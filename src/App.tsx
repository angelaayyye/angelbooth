import { useEffect, useMemo, useState } from 'react';
import type {
  AppStep,
  CapturedPhoto,
  LayoutOption,
  SessionMode,
  ThemeOption,
} from './types';
import { mergeAllDuoSlots, mergeDuoPhotos } from './utils/mergeDuoPhotos';
import { LAYOUTS, THEMES, COUNTDOWN_SECONDS } from './constants';
import { useRoom } from './hooks/useRoom';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SetupScreen } from './components/SetupScreen';
import { RoomLobby } from './components/RoomLobby';
import { CameraCapture } from './components/CameraCapture';
import { StripEditor } from './components/StripEditor';

function App() {
  const [step, setStep] = useState<AppStep>('welcome');
  const [layout, setLayout] = useState<LayoutOption>(LAYOUTS[0]);
  const [theme, setTheme] = useState<ThemeOption>(THEMES[0]);
  const [sessionMode, setSessionMode] = useState<SessionMode | null>(null);
  const [photos, setPhotos] = useState<(CapturedPhoto | undefined)[]>([]);

  const indexedPhotos = useMemo(
    () => Array.from({ length: layout.photoCount }, (_, i) => photos[i]),
    [photos, layout.photoCount],
  );

  const roomApi = useRoom(sessionMode === 'remote');

  useEffect(() => {
    if (sessionMode === 'remote' && roomApi.isHost && roomApi.room) {
      roomApi.updateSettings(layout.id, theme.id, layout.photoCount);
    }
  }, [layout, theme, sessionMode, roomApi.isHost, roomApi.room?.id]);

  useEffect(() => {
    if (roomApi.room?.layoutId) {
      const remoteLayout = LAYOUTS.find((l) => l.id === roomApi.room?.layoutId);
      if (remoteLayout && !roomApi.isHost) setLayout(remoteLayout);
    }
    if (roomApi.room?.themeId) {
      const remoteTheme = THEMES.find((t) => t.id === roomApi.room?.themeId);
      if (remoteTheme && !roomApi.isHost) setTheme(remoteTheme);
    }
  }, [roomApi.room?.layoutId, roomApi.room?.themeId, roomApi.isHost]);

  useEffect(() => {
    if (roomApi.room?.phase === 'capture' && step === 'lobby') {
      setPhotos(Array.from({ length: layout.photoCount }, () => undefined));
      setStep('capture');
    }
  }, [roomApi.room?.phase, step, layout.photoCount]);

  useEffect(() => {
    if (!roomApi.duoSlotReady) return;

    const { photoIndex, parts } = roomApi.duoSlotReady;
    mergeDuoPhotos(parts).then((dataUrl) => {
      setPhotos((prev) => {
        const next = Array.from({ length: layout.photoCount }, (_, i) => prev[i]);
        next[photoIndex] = {
          id: `duo-${photoIndex}-${Date.now()}`,
          dataUrl,
        };
        return next;
      });
      roomApi.clearDuoSlotReady();
    });
  }, [roomApi.duoSlotReady, layout.photoCount, roomApi.clearDuoSlotReady]);

  useEffect(() => {
    if (!roomApi.captureComplete || !roomApi.duoPhotosComplete || step !== 'capture') return;

    mergeAllDuoSlots(roomApi.duoPhotosComplete).then((merged) => {
      const result = merged.map((dataUrl, i) =>
        dataUrl
          ? { id: `duo-final-${i}`, dataUrl }
          : undefined,
      );
      setPhotos(result);
      setStep('decorate');
    });
  }, [roomApi.captureComplete, roomApi.duoPhotosComplete]);

  const handleRestart = () => {
    setPhotos([]);
    if (sessionMode === 'remote') {
      roomApi.leaveRoom();
    }
    setSessionMode(null);
    setStep('welcome');
  };

  const handleSetupContinue = () => {
    if (!sessionMode) return;
    if (sessionMode === 'remote') {
      setStep('lobby');
    } else {
      setPhotos(Array.from({ length: layout.photoCount }, () => undefined));
      setStep('capture');
    }
  };

  const handleRemotePhoto = (photoIndex: number, dataUrl: string) => {
    roomApi.sendPhoto(photoIndex, dataUrl);
  };

  const visibleSteps: AppStep[] =
    sessionMode === 'remote'
      ? ['welcome', 'setup', 'lobby', 'capture', 'decorate']
      : ['welcome', 'setup', 'capture', 'decorate'];

  const stepIndex = visibleSteps.indexOf(step);

  return (
    <div className="app">
      {step !== 'welcome' && step !== 'setup' && step !== 'lobby' && step !== 'capture' && step !== 'decorate' && (
        <header className="app-header">
          <div className="logo">
            <span className="logo-icon">📸</span>
            <div>
              <h1 className="logo-title">Photobooth</h1>
              <p className="logo-subtitle">Photo strips &amp; stickers</p>
            </div>
          </div>
          <div className="step-indicator">
            {visibleSteps.slice(1).map((s, i) => (
              <span
                key={s}
                className={`step-dot ${step === s ? 'active' : ''} ${stepIndex > i + 1 ? 'done' : ''}`}
              />
            ))}
          </div>
        </header>
      )}

      <main className={`app-main ${step === 'welcome' || step === 'setup' || step === 'lobby' || step === 'capture' || step === 'decorate' ? 'app-main-full' : ''}`}>
        {step === 'welcome' && (
          <WelcomeScreen onStart={() => setStep('setup')} />
        )}

        {step === 'setup' && (
          <SetupScreen
            selectedLayout={layout}
            selectedTheme={theme}
            sessionMode={sessionMode}
            onLayoutSelect={setLayout}
            onThemeSelect={setTheme}
            onSessionModeChange={setSessionMode}
            onEnter={handleSetupContinue}
            onBack={() => setStep('welcome')}
          />
        )}

        {step === 'lobby' && (
          <RoomLobby
            room={roomApi.room}
            isHost={roomApi.isHost}
            playerId={roomApi.playerId}
            connected={roomApi.connected}
            error={roomApi.error}
            onCreateRoom={roomApi.createRoom}
            onJoinRoom={roomApi.joinRoom}
            onStartSession={() => roomApi.startSession(layout.photoCount)}
            onBack={() => {
              roomApi.leaveRoom();
              setStep('setup');
            }}
          />
        )}

        {step === 'capture' && (
          <CameraCapture
            layout={layout}
            photos={indexedPhotos}
            onPhotosChange={setPhotos}
            onComplete={() => setStep('decorate')}
            onBack={() => {
              if (sessionMode === 'remote') {
                roomApi.leaveRoom();
                setStep('setup');
              } else {
                setStep('setup');
              }
            }}
            isRemote={sessionMode === 'remote'}
            isHost={roomApi.isHost}
            playerId={roomApi.playerId}
            currentPhotoIndex={roomApi.room?.currentPhotoIndex ?? 0}
            syncCountdown={roomApi.syncCountdown}
            waitingForPartner={roomApi.waitingForPartner}
            onStartCountdown={(idx) =>
              roomApi.startCountdown(idx, COUNTDOWN_SECONDS)
            }
            onPhotoCaptured={handleRemotePhoto}
            sendWebRtcSignal={roomApi.sendWebRtcSignal}
            subscribeWebRtcSignal={roomApi.subscribeWebRtcSignal}
          />
        )}

        {step === 'decorate' && (
          <StripEditor
            layout={layout}
            photos={Array.from(
              { length: layout.photoCount },
              (_, i) => photos[i],
            ).filter((p): p is CapturedPhoto => !!p)}
            theme={theme}
            onBack={() => {
              setPhotos([]);
              roomApi.resetCapture();
              setStep('capture');
            }}
            onRestart={handleRestart}
          />
        )}
      </main>

      {step !== 'welcome' && step !== 'setup' && step !== 'lobby' && step !== 'capture' && step !== 'decorate' && (
        <footer className="app-footer">
          <p>Made with love — your online photobooth</p>
        </footer>
      )}
    </div>
  );
}

export default App;

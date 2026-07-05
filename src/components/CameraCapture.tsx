import { useCallback, useEffect, useRef, useState } from 'react';
import type { CapturedPhoto, LayoutOption } from '../types';
import { COUNTDOWN_SECONDS } from '../constants';
import { useCamera } from '../hooks/useCamera';
import { useDuoVideo } from '../hooks/useDuoVideo';
import '../capture-studio.css';

interface CameraCaptureProps {
  layout: LayoutOption;
  photos: (CapturedPhoto | undefined)[];
  onPhotosChange: (photos: (CapturedPhoto | undefined)[]) => void;
  onComplete: () => void;
  onBack: () => void;
  isRemote?: boolean;
  isHost?: boolean;
  playerId?: string | null;
  currentPhotoIndex?: number;
  syncCountdown?: {
    photoIndex: number;
    seconds: number;
    startedAt: number;
  } | null;
  waitingForPartner?: boolean;
  onStartCountdown?: (photoIndex: number) => void;
  onPhotoCaptured?: (photoIndex: number, dataUrl: string) => void;
  sendWebRtcSignal?: (signal: unknown) => void;
  subscribeWebRtcSignal?: (
    fn: (from: string, signal: unknown) => void,
  ) => () => void;
}

function useLiveClock() {
  const [clock, setClock] = useState('12:00 PM');

  useEffect(() => {
    const update = () => {
      setClock(
        new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return clock;
}

function PreviewStrip({
  layout,
  photos,
  activeIndex,
}: {
  layout: LayoutOption;
  photos: (CapturedPhoto | undefined)[];
  activeIndex: number;
}) {
  const isGrid = layout.cols > 1;
  const slotMinHeight =
    layout.photoCount <= 2 ? '6rem' : layout.photoCount === 3 ? '5rem' : '4.5rem';

  return (
    <div
      className={`w-full ${isGrid ? 'grid gap-2' : 'flex flex-col gap-2'}`}
      style={
        isGrid
          ? {
              gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
            }
          : undefined
      }
    >
      {Array.from({ length: layout.photoCount }).map((_, i) => {
        const photo = photos[i];
        const isCurrent = i === activeIndex && !photo;

        if (photo) {
          return (
            <img
              key={photo.id}
              src={photo.dataUrl}
              alt={`Photo ${i + 1}`}
              className={`w-full rounded-sm shadow-md preview-slot-filled object-cover ${
                isGrid ? 'aspect-square' : ''
              }`}
              style={!isGrid ? { minHeight: slotMinHeight } : undefined}
            />
          );
        }

        return (
          <div
            key={`empty-${i}`}
            className={`w-full border-2 border-dashed border-outline-variant rounded bg-surface/50 flex items-center justify-center text-on-surface-variant/40 ${
              isCurrent ? 'preview-slot-current' : ''
            } ${isGrid ? 'aspect-square' : ''}`}
            style={!isGrid ? { minHeight: slotMinHeight } : undefined}
          >
            <span className="material-symbols-outlined text-[32px]">
              add_photo_alternate
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function CameraCapture({
  layout,
  photos,
  onPhotosChange,
  onComplete,
  isRemote = false,
  isHost = false,
  playerId = null,
  currentPhotoIndex = 0,
  syncCountdown = null,
  waitingForPartner = false,
  onStartCountdown,
  onPhotoCaptured,
  sendWebRtcSignal,
  subscribeWebRtcSignal,
}: CameraCaptureProps) {
  const clock = useLiveClock();
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [mirrored, setMirrored] = useState(true);
  const { videoRef, isReady, error, start, stop, capture, getStream } = useCamera({
    facingMode,
    mirrored,
  });
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const noopSubscribe = useCallback(() => () => {}, []);
  const noopSend = useCallback(() => {}, []);

  const { remoteVideoRef, partnerConnected } = useDuoVideo({
    enabled: isRemote && !!sendWebRtcSignal && !!subscribeWebRtcSignal,
    isHost,
    playerId,
    localStream,
    sendSignal: sendWebRtcSignal ?? noopSend,
    subscribeSignal: subscribeWebRtcSignal ?? noopSubscribe,
  });
  const [localCountdown, setLocalCountdown] = useState<number | null>(null);
  const [remoteDisplayCount, setRemoteDisplayCount] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const capturedRef = useRef(false);

  const activeIndex = isRemote ? currentPhotoIndex : photos.filter(Boolean).length;
  const filledCount = photos.filter(Boolean).length;
  const remaining = layout.photoCount - filledCount;
  const allCaptured = filledCount >= layout.photoCount;

  const sidebarStatus = waitingForPartner
    ? 'Combining photos…'
    : allCaptured
      ? 'All done!'
      : isRemote
        ? `Photo ${Math.min(activeIndex + 1, layout.photoCount)} of ${layout.photoCount}`
        : remaining > 0
          ? `${remaining} more to go!`
          : 'Ready to shoot!';

  const takePhoto = useCallback(() => {
    if (capturedRef.current) return;
    capturedRef.current = true;

    const dataUrl = capture();
    if (!dataUrl) {
      capturedRef.current = false;
      return;
    }

    setFlash(true);
    setTimeout(() => setFlash(false), 550);

    if (isRemote && onPhotoCaptured) {
      onPhotoCaptured(activeIndex, dataUrl);
    } else if (!isRemote) {
      const newPhoto: CapturedPhoto = {
        id: crypto.randomUUID(),
        dataUrl,
      };
      const slotIndex = photos.filter(Boolean).length;
      const updated = Array.from(
        { length: layout.photoCount },
        (_, i) => photos[i],
      );
      updated[slotIndex] = newPhoto;
      onPhotosChange(updated);
      if (slotIndex + 1 >= layout.photoCount) {
        setTimeout(() => onComplete(), 600);
      }
    }
  }, [
    capture,
    isRemote,
    onPhotoCaptured,
    activeIndex,
    photos,
    onPhotosChange,
    layout.photoCount,
    onComplete,
  ]);

  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop, facingMode]);

  useEffect(() => {
    if (isReady) {
      setLocalStream(getStream());
    }
  }, [isReady, getStream, facingMode]);

  useEffect(() => {
    setMirrored(facingMode === 'user');
  }, [facingMode]);

  useEffect(() => {
    capturedRef.current = false;
    setLocalCountdown(null);
    setRemoteDisplayCount(null);
  }, [activeIndex]);

  useEffect(() => {
    if (!waitingForPartner) return;
    capturedRef.current = true;
  }, [waitingForPartner]);

  useEffect(() => {
    if (isRemote || localCountdown === null) return;

    if (localCountdown === 0) {
      setLocalCountdown(null);
      takePhoto();
      return;
    }

    const timer = setTimeout(() => {
      setLocalCountdown((c) => (c !== null ? c - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRemote, localCountdown, takePhoto]);

  useEffect(() => {
    if (!isRemote || !syncCountdown || syncCountdown.photoIndex !== activeIndex) {
      setRemoteDisplayCount(null);
      return;
    }

    const tick = () => {
      const elapsed = Math.floor((Date.now() - syncCountdown.startedAt) / 1000);
      const remainingSeconds = Math.max(0, syncCountdown.seconds - elapsed);
      setRemoteDisplayCount(remainingSeconds);

      if (remainingSeconds === 0 && !capturedRef.current && !waitingForPartner) {
        takePhoto();
      }
    };

    tick();
    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [isRemote, syncCountdown, activeIndex, takePhoto, waitingForPartner]);

  const displayCount = isRemote ? remoteDisplayCount : localCountdown;

  const startCountdown = useCallback(() => {
    if (activeIndex >= layout.photoCount) return;
    if (displayCount !== null || waitingForPartner) return;

    if (isRemote) {
      onStartCountdown?.(activeIndex);
    } else {
      capturedRef.current = false;
      setLocalCountdown(COUNTDOWN_SECONDS);
    }
  }, [
    activeIndex,
    layout.photoCount,
    displayCount,
    waitingForPartner,
    isRemote,
    onStartCountdown,
  ]);

  const handleFlip = () => {
    stop();
    setFacingMode((m) => (m === 'user' ? 'environment' : 'user'));
  };

  const viewfinderContent = (
    <>
      {isRemote ? (
        <div className="absolute inset-0 flex">
          <div className="relative flex-1 min-w-0 overflow-hidden">
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover ${mirrored ? 'camera-mirror' : ''}`}
              playsInline
              muted
              autoPlay
            />
            <span className="duo-viewfinder-label">You</span>
          </div>
          <div className="w-1 bg-white shrink-0 z-10" />
          <div className="relative flex-1 min-w-0 overflow-hidden bg-zinc-900">
            <video
              ref={remoteVideoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              autoPlay
            />
            {!partnerConnected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/70 px-4 text-center">
                <span className="material-symbols-outlined text-[32px] opacity-60">
                  person
                </span>
                <span className="text-[12px] font-medium">Friend connecting…</span>
              </div>
            )}
            <span className="duo-viewfinder-label">Friend</span>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${mirrored ? 'camera-mirror' : ''}`}
          playsInline
          muted
          autoPlay
        />
      )}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center text-white/80 text-body-md z-20">
          Loading camera…
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none border-[12px] border-white/10 rounded-2xl" />
      {isReady && (
        <>
          <div className="absolute top-4 left-4 bg-red-500 w-2 h-2 rounded-full animate-pulse z-10" />
          <div className="absolute top-4 left-8 text-white text-[10px] font-label-pixel tracking-widest uppercase z-10">
            {isRemote ? 'Duo live' : 'Recording'}
          </div>
        </>
      )}
      {displayCount !== null && (
        <div className="countdown-overlay">
          <span className="countdown-number">
            {displayCount > 0 ? displayCount : '📸'}
          </span>
        </div>
      )}
    </>
  );

  const shutterDisabled =
    !isReady ||
    displayCount !== null ||
    activeIndex >= layout.photoCount ||
    waitingForPartner;

  return (
    <div className="capture-studio-root light h-screen w-screen overflow-hidden font-body-md text-on-surface select-none">
      {flash && <div className="camera-flash-overlay" aria-hidden />}

      {/* Top menu bar */}
      <header className="fixed top-0 w-full h-8 flex justify-between items-center px-4 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 z-[100] text-on-surface font-label-ui text-[12px]">
        <div className="flex items-center gap-4">
          <span className="font-bold text-on-surface">Purikura Studio</span>
          <span className="hover:bg-surface-variant/50 px-2 rounded cursor-default">File</span>
          <span className="hover:bg-surface-variant/50 px-2 rounded cursor-default">Edit</span>
          <span className="hover:bg-surface-variant/50 px-2 rounded cursor-default">Effect</span>
          <span className="hover:bg-surface-variant/50 px-2 rounded cursor-default">Help</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[16px]">wifi</span>
          <span className="material-symbols-outlined text-[16px]">battery_full</span>
          <span className="material-symbols-outlined text-[16px]">search</span>
          <span className="material-symbols-outlined text-[16px]">menu</span>
          <span className="font-bold ml-1">{clock}</span>
        </div>
      </header>

      {/* Notification */}
      <div className="fixed top-12 right-4 w-80 glass-panel rounded-xl p-4 shadow-xl border border-white/40 flex items-start gap-3 z-[110]">
        <div className="w-10 h-10 rounded-lg bg-error flex items-center justify-center text-white">
          <span className="material-symbols-outlined">mail</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="font-bold text-[13px]">Gmail</span>
            <span className="text-[11px] opacity-60">now</span>
          </div>
          <p className="text-[13px] leading-tight mt-1">make sure to share ur code</p>
        </div>
      </div>

      {/* Main window */}
      <main className="flex items-center justify-center h-full pt-8 pb-24">
        <div className="w-[1000px] max-w-[calc(100vw-2rem)] h-[680px] max-h-[calc(100vh-8rem)] bg-surface rounded-2xl overflow-hidden flex window-shadow border border-white/20">
          {/* Sidebar */}
          <aside className="w-72 shrink-0 bg-surface-container-low flex flex-col border-r-2 border-outline-variant hidden sm:flex">
            <div className="p-6">
              <h1 className="font-headline-md text-headline-md text-primary mb-4">Photobooth</h1>
              <div className="relative mb-6">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                  search
                </span>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-lg pl-10 pr-3 py-1.5 text-body-md focus:ring-2 focus:ring-primary/20"
                  placeholder="Search"
                  type="text"
                  readOnly
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-2 space-y-1">
              <div className="bg-primary-container text-on-primary-container rounded-lg p-3 flex items-center gap-3 font-bold transition-all">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">auto_awesome</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-body-md truncate">Digital Diary</span>
                    <span className="text-[11px] font-normal opacity-70 shrink-0">{clock}</span>
                  </div>
                  <p className="text-[12px] font-normal truncate">{sidebarStatus}</p>
                </div>
              </div>
              <div className="text-on-surface-variant p-3 flex items-center gap-3 hover:bg-surface-container-high transition-colors rounded-lg cursor-default">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined">photo_camera</span>
                </div>
                <div className="flex-1">
                  <span className="text-body-md">Capture Session</span>
                </div>
              </div>
              <div className="text-on-surface-variant p-3 flex items-center gap-3 hover:bg-surface-container-high transition-colors rounded-lg cursor-default">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">grid_view</span>
                </div>
                <div className="flex-1">
                  <span className="text-body-md">Library</span>
                </div>
              </div>
              <div className="text-on-surface-variant p-3 flex items-center gap-3 hover:bg-surface-container-high transition-colors rounded-lg cursor-default">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined">settings</span>
                </div>
                <div className="flex-1">
                  <span className="text-body-md">Settings</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Viewfinder area */}
          <div className="flex-1 flex flex-col bg-surface min-w-0">
            <div className="h-14 flex items-center justify-between px-6 border-b border-outline-variant/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400 border border-black/10" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black/10" />
                  <div className="w-3 h-3 rounded-full bg-green-400 border border-black/10" />
                </div>
                <span className="font-label-ui text-label-ui font-bold ml-4">Studio Viewfinder</span>
              </div>
              <div className="flex items-center gap-4 text-on-surface-variant">
                <button
                  type="button"
                  onClick={() => setMirrored((m) => !m)}
                  className={`material-symbols-outlined cursor-pointer hover:text-primary bg-transparent border-none p-0 ${mirrored ? 'text-primary' : ''}`}
                  title="Mirror camera"
                >
                  flip
                </button>
                <button
                  type="button"
                  onClick={handleFlip}
                  className="material-symbols-outlined cursor-pointer hover:text-primary bg-transparent border-none p-0"
                  title="Flip camera"
                >
                  cameraswitch
                </button>
                <span className="material-symbols-outlined cursor-pointer hover:text-primary">timer</span>
                <span className="material-symbols-outlined cursor-pointer hover:text-primary">flash_on</span>
                <span className="material-symbols-outlined cursor-pointer hover:text-primary">more_horiz</span>
              </div>
            </div>

            <div className="flex-1 flex p-4 sm:p-6 gap-4 sm:gap-6 overflow-hidden min-h-0">
              {/* Camera viewfinder */}
              <div className="flex-1 relative bg-black rounded-2xl overflow-hidden border-2 border-outline-variant shadow-inner group min-w-0">
                {error ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-white text-center">
                    <p className="text-body-md">{error}</p>
                    <button
                      type="button"
                      onClick={start}
                      className="px-4 py-2 bg-primary text-white rounded-lg font-semibold"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  viewfinderContent
                )}

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={startCountdown}
                    disabled={shutterDisabled}
                    className="w-16 h-16 rounded-full bg-white border-4 border-white/50 p-1 shutter-press transition-transform shadow-lg group-hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Take photo"
                  >
                    <div className="w-full h-full rounded-full bg-red-500 border-2 border-white" />
                  </button>
                  <span className="font-label-pixel text-[10px] text-white bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                    {waitingForPartner ? 'WAIT…' : 'SMILE!'}
                  </span>
                </div>
              </div>

              {/* Preview strip */}
              <div className="w-36 sm:w-48 h-full flex flex-col gap-2 shrink-0">
                <div className="flex justify-between items-center px-1">
                  <span className="font-label-pixel text-label-pixel text-primary uppercase">
                    Preview
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                    history
                  </span>
                </div>
                <div className="flex-1 bg-surface-container-high rounded-xl p-3 border-2 border-outline-variant flex flex-col items-center justify-start overflow-y-auto min-h-0">
                  <PreviewStrip
                    layout={layout}
                    photos={photos}
                    activeIndex={activeIndex}
                  />
                </div>
                <button
                  type="button"
                  onClick={onComplete}
                  disabled={!allCaptured}
                  className="mt-2 w-full py-2 bg-secondary text-white font-label-ui rounded-lg shadow-[4px_4px_0px_0px_rgba(39,106,77,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0px_0px_rgba(39,106,77,1)]"
                >
                  <span className="material-symbols-outlined text-[18px]">ios_share</span>
                  Share strip
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dock */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 flex justify-center items-center gap-3 px-4 py-3 glass-panel rounded-2xl border border-white/40 shadow-2xl z-[100]">
        <div className="dock-item group relative cursor-default">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-gray-200 to-white flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-gray-600 text-[28px]">apps</span>
          </div>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Launchpad
          </span>
        </div>
        <div className="dock-item group relative cursor-default">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-300 to-blue-500 flex items-center justify-center shadow-sm overflow-hidden">
            <span className="material-symbols-outlined text-white text-[28px]">sentiment_satisfied</span>
          </div>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Finder
          </span>
        </div>
        <div className="dock-item group relative cursor-default">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-green-400 to-green-600 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-[28px]">chat</span>
          </div>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Messages
          </span>
        </div>
        <div className="dock-item group relative cursor-default scale-110">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-md border-2 border-white">
            <span className="material-symbols-outlined text-white text-[28px]">photo_camera</span>
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-fixed-dim" />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Photobooth
          </span>
        </div>
        <div className="dock-item group relative cursor-default">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-400 to-red-400 flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-[28px]">music_note</span>
          </div>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Music
          </span>
        </div>
        <div className="w-px h-10 bg-black/10 mx-1" />
        <div className="dock-item group relative cursor-default">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-black/60 text-[28px]">delete</span>
          </div>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Trash
          </span>
        </div>
      </nav>

      {/* Floating decor */}
      <div className="fixed top-20 left-10 pointer-events-none opacity-40 animate-pulse">
        <span className="material-symbols-outlined text-primary text-[48px]">star</span>
      </div>
      <div className="fixed bottom-40 right-20 pointer-events-none opacity-40 animate-pulse">
        <span className="material-symbols-outlined text-secondary text-[40px]">favorite</span>
      </div>
    </div>
  );
}

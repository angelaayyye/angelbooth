import { useCallback, useEffect, useRef, useState } from 'react';
import type { CapturedPhoto, LayoutOption } from '../types';
import { COUNTDOWN_SECONDS } from '../constants';
import { useCamera } from '../hooks/useCamera';
import { useDuoVideo } from '../hooks/useDuoVideo';
import '../kstyle.css';

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

function PreviewStrip({
  layout,
  photos,
  activeIndex,
}: {
  layout: LayoutOption;
  photos: (CapturedPhoto | undefined)[];
  activeIndex: number;
}) {
  return (
    <div className="kstyle-preview-strip">
      {Array.from({ length: layout.photoCount }).map((_, i) => {
        const photo = photos[i];
        const isCurrent = i === activeIndex && !photo;

        if (photo) {
          return (
            <img
              key={photo.id}
              src={photo.dataUrl}
              alt={`Photo ${i + 1}`}
              className="kstyle-preview-slot-filled"
              style={{ aspectRatio: `${layout.aspectRatio}` }}
            />
          );
        }

        return (
          <div
            key={`empty-${i}`}
            className={`kstyle-preview-empty ${isCurrent ? 'kstyle-preview-current' : ''}`}
            style={{ aspectRatio: `${layout.aspectRatio}` }}
          >
            +
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
  onBack,
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
  const allCaptured = filledCount >= layout.photoCount;

  // Solo: match strip slot. Duo: each half of the merged slot.
  const captureAspect = isRemote
    ? layout.aspectRatio / 2
    : layout.aspectRatio;

  const takePhoto = useCallback(() => {
    if (capturedRef.current) return;
    capturedRef.current = true;

    const dataUrl = capture(captureAspect);
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
      const updated = Array.from({ length: layout.photoCount }, (_, i) => photos[i]);
      updated[slotIndex] = newPhoto;
      onPhotosChange(updated);
      if (slotIndex + 1 >= layout.photoCount) {
        setTimeout(() => onComplete(), 600);
      }
    }
  }, [
    capture,
    captureAspect,
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
    if (isReady) setLocalStream(getStream());
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
    if (waitingForPartner) {
      capturedRef.current = true;
    } else if (syncCountdown === null) {
      capturedRef.current = false;
    }
  }, [waitingForPartner, syncCountdown]);

  useEffect(() => {
    if (isRemote || localCountdown === null) return;
    if (localCountdown === 0) {
      setLocalCountdown(null);
      takePhoto();
      return;
    }
    const timer = setTimeout(() => setLocalCountdown((c) => (c !== null ? c - 1 : null)), 1000);
    return () => clearTimeout(timer);
  }, [isRemote, localCountdown, takePhoto]);

  const tryRemoteCapture = useCallback(() => {
    if (!syncCountdown || syncCountdown.photoIndex !== activeIndex) return;
    const elapsed = Math.floor((Date.now() - syncCountdown.startedAt) / 1000);
    const remainingSeconds = Math.max(0, syncCountdown.seconds - elapsed);
    setRemoteDisplayCount(remainingSeconds);
    if (remainingSeconds === 0 && !capturedRef.current && !waitingForPartner) {
      takePhoto();
    }
  }, [syncCountdown, activeIndex, takePhoto, waitingForPartner]);

  useEffect(() => {
    if (!isRemote || !syncCountdown || syncCountdown.photoIndex !== activeIndex) {
      setRemoteDisplayCount(null);
      return;
    }
    tryRemoteCapture();
    const interval = setInterval(tryRemoteCapture, 100);
    return () => clearInterval(interval);
  }, [isRemote, syncCountdown, activeIndex, tryRemoteCapture]);

  useEffect(() => {
    if (!isRemote || !syncCountdown) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        tryRemoteCapture();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [isRemote, syncCountdown, tryRemoteCapture]);

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
  }, [activeIndex, layout.photoCount, displayCount, waitingForPartner, isRemote, onStartCountdown]);

  const handleFlip = () => {
    stop();
    setFacingMode((m) => (m === 'user' ? 'environment' : 'user'));
  };

  const shutterDisabled =
    !isReady ||
    displayCount !== null ||
    activeIndex >= layout.photoCount ||
    waitingForPartner;

  const photoLabel = `${Math.min(activeIndex + 1, layout.photoCount)} / ${layout.photoCount}`;

  return (
    <div className="kstyle-capture">
      {flash && <div className="kstyle-flash" aria-hidden />}

      <header className="kstyle-capture-bar">
        <button type="button" className="kstyle-nav-back" onClick={onBack} style={{ color: 'rgba(255,255,255,0.7)' }}>
          ← back
        </button>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>
          {waitingForPartner ? 'combining…' : photoLabel}
        </span>
        <div className="kstyle-capture-controls">
          <button
            type="button"
            className={`kstyle-icon-btn ${mirrored ? 'active' : ''}`}
            onClick={() => setMirrored((m) => !m)}
            title="Mirror"
          >
            ⇆
          </button>
          <button type="button" className="kstyle-icon-btn" onClick={handleFlip} title="Flip camera">
            ⟳
          </button>
        </div>
      </header>

      <div className="kstyle-capture-body">
        <div className="kstyle-viewfinder">
          <div className="kstyle-viewfinder-stage">
            <div
              className="kstyle-frame-slot"
              style={
                {
                  aspectRatio: `${layout.aspectRatio}`,
                  '--slot-ratio': String(layout.aspectRatio),
                } as React.CSSProperties
              }
            >
              {error ? (
                <div className="kstyle-frame-fill flex flex-col items-center justify-center gap-4 p-6 text-center text-white/80">
                  <p>{error}</p>
                  <button type="button" className="kstyle-btn-primary" onClick={start}>
                    try again
                  </button>
                </div>
              ) : isRemote ? (
                <div className="kstyle-frame-fill kstyle-duo-frame">
                  <div className="kstyle-duo-half">
                    <video
                      ref={videoRef}
                      className={`kstyle-frame-video ${mirrored ? 'kstyle-camera-mirror' : ''}`}
                      playsInline
                      muted
                      autoPlay
                    />
                    <span className="kstyle-duo-label">you</span>
                  </div>
                  <div className="kstyle-duo-divider" />
                  <div className="kstyle-duo-half">
                    <video
                      ref={remoteVideoRef}
                      className="kstyle-frame-video"
                      playsInline
                      autoPlay
                    />
                    {!partnerConnected && (
                      <div className="kstyle-duo-waiting">
                        friend connecting…
                      </div>
                    )}
                    <span className="kstyle-duo-label">friend</span>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  className={`kstyle-frame-video ${mirrored ? 'kstyle-camera-mirror' : ''}`}
                  playsInline
                  muted
                  autoPlay
                />
              )}

              {!isReady && !error && (
                <div className="kstyle-frame-overlay">loading camera…</div>
              )}

              {displayCount !== null && (
                <div className="kstyle-countdown">
                  <span className="kstyle-countdown-num">
                    {displayCount > 0 ? displayCount : '📸'}
                  </span>
                </div>
              )}
            </div>

            <p className="kstyle-frame-hint">
              this is your strip photo frame
            </p>

            <div className="kstyle-shutter-wrap kstyle-shutter-wrap--framed">
              <button
                type="button"
                className="kstyle-shutter"
                onClick={startCountdown}
                disabled={shutterDisabled}
                aria-label="Take photo"
              >
                <div className="kstyle-shutter-inner" />
              </button>
              <span className="kstyle-shutter-label">
                {waitingForPartner ? 'waiting for friend…' : 'smile!'}
              </span>
            </div>
          </div>
        </div>

        <aside className="kstyle-capture-sidebar">
          <span className="kstyle-capture-sidebar-label">strip</span>
          <PreviewStrip layout={layout} photos={photos} activeIndex={activeIndex} />
          <button
            type="button"
            className="kstyle-btn-primary w-full justify-center text-xs py-1.5"
            onClick={onComplete}
            disabled={!allCaptured}
            style={{ opacity: allCaptured ? 1 : 0.4, flexShrink: 0 }}
          >
            done →
          </button>
        </aside>
      </div>
    </div>
  );
}

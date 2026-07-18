import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCameraOptions {
  facingMode?: 'user' | 'environment';
  mirrored?: boolean;
}

export function useCamera({
  facingMode = 'user',
  mirrored = true,
}: UseCameraOptions = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    setError(null);
    setIsReady(false);

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsReady(true);
      }
    } catch {
      setError(
        'Camera access denied. Please allow camera permissions and refresh.',
      );
    }
  }, [facingMode]);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsReady(false);
  }, []);

  /** Capture cropped to the strip slot aspect ratio (width / height). */
  const capture = useCallback(
    (aspectRatio = 3 / 4): string | null => {
      const video = videoRef.current;
      if (!video || !isReady || video.videoWidth === 0 || video.videoHeight === 0) {
        return null;
      }

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const videoRatio = vw / vh;

      let sx = 0;
      let sy = 0;
      let sw = vw;
      let sh = vh;

      if (videoRatio > aspectRatio) {
        sw = Math.round(vh * aspectRatio);
        sx = Math.round((vw - sw) / 2);
      } else {
        sh = Math.round(vw / aspectRatio);
        sy = Math.round((vh - sh) / 2);
      }

      const outW = Math.min(900, sw);
      const outH = Math.round(outW / aspectRatio);

      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;

      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      if (mirrored) {
        ctx.translate(outW, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, outW, outH);

      return canvas.toDataURL('image/jpeg', 0.92);
    },
    [isReady, mirrored],
  );

  const getStream = useCallback(() => streamRef.current, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return { videoRef, isReady, error, start, stop, capture, getStream };
}

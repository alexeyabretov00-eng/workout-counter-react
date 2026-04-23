import { useCallback, useRef } from 'react';

export const useCameraStream = (onError?: (error: string) => void, onReady?: () => void) => {
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(
    async (videoEl: HTMLVideoElement | null): Promise<void> => {
      if (!videoEl) {
        return;
      }

      stopCamera();

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        streamRef.current = stream;
        videoEl.srcObject = stream;

        await videoEl.play();

        onReady?.();
      } catch (error) {
        onError?.(error instanceof Error ? error.message : 'Не удалось открыть камеру');
      }
    },
    [stopCamera, onError, onReady],
  );

  return {
    startCamera,
    stopCamera,
  };
};

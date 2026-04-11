import { useCallback, useRef, useState } from 'react'
import type { EntityStatus } from '../types'

export const useCameraStream = () => {
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraState, setCameraState] = useState<{
    status: EntityStatus
    cameraError: string | null
  }>({
    status: 'idle',
    cameraError: null,
  })

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    
    setCameraState((prev) => ({
      ...prev,
      status: 'idle',
    }))
  }, [])

  const startCamera = useCallback(async (videoEl: HTMLVideoElement | null): Promise<void> => {
    if (!videoEl) {
      return
    }

    stopCamera()
    setCameraState({
      status: 'initializing',
      cameraError: null,
    })

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      streamRef.current = stream
      videoEl.srcObject = stream

      await videoEl.play()

      setCameraState({
        status: 'ready',
        cameraError: null,
      })
    } catch (error) {
      setCameraState({
        status: 'error',
        cameraError: error instanceof Error ? error.message : 'Не удалось открыть камеру',
      })
    }
  }, [stopCamera])

  return {
    startCamera,
    stopCamera,
    cameraStatus: cameraState.status,
    cameraError: cameraState.cameraError,
  }
}

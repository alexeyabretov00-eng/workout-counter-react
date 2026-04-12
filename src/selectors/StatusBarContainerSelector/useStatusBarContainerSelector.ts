import { useMemo } from 'react'
import { useWorkoutSessionChromeStatusContext } from '../../contexts'

export const useStatusBarContainerSelector = () => {
  const ctx = useWorkoutSessionChromeStatusContext()
  return useMemo(
    () => ({
      modelStatus: ctx.modelStatus,
      modelStatusLabel: ctx.modelStatusLabel,
      isCameraReady: ctx.isCameraReady,
      voiceStatus: ctx.voiceStatus,
      voiceStatusLabel: ctx.voiceStatusLabel,
      isPaused: ctx.isPaused,
      cameraError: ctx.cameraError,
    }),
    [
      ctx.modelStatus,
      ctx.modelStatusLabel,
      ctx.isCameraReady,
      ctx.voiceStatus,
      ctx.voiceStatusLabel,
      ctx.isPaused,
      ctx.cameraError,
    ],
  )
}

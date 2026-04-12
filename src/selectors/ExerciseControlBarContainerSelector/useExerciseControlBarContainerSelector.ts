import { useMemo } from 'react'
import { useWorkoutSessionChromeControlsContext } from '../../contexts'

export const useExerciseControlBarContainerSelector = () => {
  const ctx = useWorkoutSessionChromeControlsContext()
  return useMemo(
    () => ({
      exerciseId: ctx.exerciseId,
      restDurationMinutes: ctx.restDurationMinutes,
      isRunning: ctx.isRunning,
      isModelReady: ctx.isModelReady,
      isCameraInitializing: ctx.isCameraInitializing,
      resetStopEnabled: ctx.resetStopEnabled,
      dispatchChromeControl: ctx.dispatchChromeControl,
    }),
    [
      ctx.exerciseId,
      ctx.restDurationMinutes,
      ctx.isRunning,
      ctx.isModelReady,
      ctx.isCameraInitializing,
      ctx.resetStopEnabled,
      ctx.dispatchChromeControl,
    ],
  )
}

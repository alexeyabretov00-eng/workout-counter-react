import { useMemo } from 'react'
import { useWorkoutSessionChromeControlsContext } from '../../contexts'

export const useExerciseControlBarContainerSelector = () => {
  const ctx = useWorkoutSessionChromeControlsContext()
  return useMemo(
    () => ({
      exerciseId: ctx.exerciseId,
      setExerciseId: ctx.setExerciseId,
      restDurationMinutes: ctx.restDurationMinutes,
      setRestDurationMinutes: ctx.setRestDurationMinutes,
      isRunning: ctx.isRunning,
      isModelReady: ctx.isModelReady,
      isCameraInitializing: ctx.isCameraInitializing,
      resetStopEnabled: ctx.resetStopEnabled,
      dispatchChromeControl: ctx.dispatchChromeControl,
    }),
    [
      ctx.exerciseId,
      ctx.setExerciseId,
      ctx.restDurationMinutes,
      ctx.setRestDurationMinutes,
      ctx.isRunning,
      ctx.isModelReady,
      ctx.isCameraInitializing,
      ctx.resetStopEnabled,
      ctx.dispatchChromeControl,
    ],
  )
}

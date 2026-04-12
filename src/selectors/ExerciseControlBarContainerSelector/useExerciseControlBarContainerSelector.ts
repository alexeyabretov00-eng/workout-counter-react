import { useMemo } from 'react'
import { useWorkoutSessionChromeContext } from '../../contexts'

export function useExerciseControlBarContainerSelector() {
  const ctx = useWorkoutSessionChromeContext()
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
      start: ctx.start,
      pause: ctx.pause,
      reset: ctx.reset,
      shutdown: ctx.shutdown,
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
      ctx.start,
      ctx.pause,
      ctx.reset,
      ctx.shutdown,
    ],
  )
}

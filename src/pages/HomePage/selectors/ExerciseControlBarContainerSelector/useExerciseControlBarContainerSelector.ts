import { useMemo } from 'react'
import type { SelectOption } from '../../../../components'
import { useWorkoutSessionChromeControlsContext } from '../../contexts'

const REST_DURATION_MINUTES = [1, 2, 3, 5] as const

const REST_DURATION_OPTIONS: SelectOption[] = REST_DURATION_MINUTES.map((minutes) => ({
  value: String(minutes),
  label: `${minutes} мин`,
}))

export const useExerciseControlBarContainerSelector = () => {
  const ctx = useWorkoutSessionChromeControlsContext()
  return useMemo(
    () => ({
      exerciseId: ctx.exerciseId,
      restDurationMinutes: ctx.restDurationMinutes,
      restDurationOptions: REST_DURATION_OPTIONS,
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

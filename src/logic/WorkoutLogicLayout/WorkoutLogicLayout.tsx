import { useMemo, useState, type ReactNode } from 'react'
import {
  WorkoutSessionChromeControlsContext,
  WorkoutSessionChromeStatusContext,
  WorkoutSessionStageContext,
  type WorkoutSessionChromeControlsValue,
  type WorkoutSessionChromeStatusValue,
} from '../../contexts'
import { exerciseRegistry } from '../../exercises'
import { useSpeechRecognition, useWorkoutSession } from '../../hooks'

export type WorkoutLogicLayoutProps = {
  children: ReactNode
}

export const WorkoutLogicLayout = ({ children }: WorkoutLogicLayoutProps) => {
  const [exerciseId, setExerciseId] = useState(exerciseRegistry[0].id)
  const [restDurationMinutes, setRestDurationMinutes] = useState<number>(3)
  const {
    canvasRef,
    isRunning,
    isPaused,
    isRestCountdownActive,
    modelStatus,
    isModelReady,
    isCameraReady,
    isCameraInitializing,
    cameraError,
    start,
    pause,
    reset,
    shutdown,
  } = useWorkoutSession(exerciseId, restDurationMinutes * 60_000)

  const { voiceStatus } = useSpeechRecognition({
    exercises: exerciseRegistry,
    isRunning,
    isRestCountdownActive,
    isCameraInitializing,
    isModelReady,
    start,
    pause,
    reset,
    shutdown,
    onExerciseSelect: setExerciseId,
    onRestDurationSelect: setRestDurationMinutes,
  })

  const resetStopEnabled = isRunning && !isRestCountdownActive

  const controlsValue = useMemo<WorkoutSessionChromeControlsValue>(
    () => ({
      exerciseId,
      setExerciseId,
      restDurationMinutes,
      setRestDurationMinutes,
      isRunning,
      resetStopEnabled,
      isModelReady,
      isCameraInitializing,
      start,
      pause,
      reset,
      shutdown,
    }),
    [
      exerciseId,
      restDurationMinutes,
      isRunning,
      resetStopEnabled,
      isModelReady,
      isCameraInitializing,
      start,
      pause,
      reset,
      shutdown,
    ],
  )

  const statusValue = useMemo<WorkoutSessionChromeStatusValue>(
    () => ({
      modelStatus,
      isCameraReady,
      voiceStatus,
      isPaused,
      cameraError,
    }),
    [modelStatus, isCameraReady, voiceStatus, isPaused, cameraError],
  )

  const stageValue = useMemo(
    () => ({
      canvasRef,
      isCameraInitializing,
      isPaused,
    }),
    [canvasRef, isCameraInitializing, isPaused],
  )

  return (
    <WorkoutSessionChromeControlsContext.Provider value={controlsValue}>
      <WorkoutSessionChromeStatusContext.Provider value={statusValue}>
        <WorkoutSessionStageContext.Provider value={stageValue}>{children}</WorkoutSessionStageContext.Provider>
      </WorkoutSessionChromeStatusContext.Provider>
    </WorkoutSessionChromeControlsContext.Provider>
  )
}

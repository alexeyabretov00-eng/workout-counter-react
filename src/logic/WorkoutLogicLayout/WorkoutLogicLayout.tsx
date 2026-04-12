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
import type { EntityStatus, VoiceStatus } from '../../types'

const VOICE_STATUS_LABEL: Record<VoiceStatus, string> = {
  unsupported: 'Голос: не поддерживается',
  starting: 'Голос: запуск',
  listening: 'Голос: слушаю',
  'inactive-tab': 'Голос: переключитесь на эту вкладку',
  blocked: 'Голос: доступ к микрофону запрещен',
  error: 'Голос: ошибка распознавания',
}

const MODEL_STATUS_LABEL: Record<EntityStatus, string> = {
  idle: 'ожидание',
  initializing: 'инициализация',
  loading: 'загружается',
  ready: 'загружена',
  error: 'не загружена',
}

export type WorkoutLogicLayoutProps = {
  children: ReactNode
}

export function WorkoutLogicLayout({ children }: WorkoutLogicLayoutProps) {
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
      modelStatusLabel: MODEL_STATUS_LABEL,
      isCameraReady,
      voiceStatus,
      voiceStatusLabel: VOICE_STATUS_LABEL,
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

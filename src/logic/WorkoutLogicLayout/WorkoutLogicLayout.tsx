import { useMemo, useState, type ReactNode } from 'react'
import {
  WorkoutSessionChromeContext,
  WorkoutSessionStageContext,
  type WorkoutSessionChromeValue,
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

  const chromeValue = useMemo<WorkoutSessionChromeValue>(
    () => ({
      exerciseId,
      setExerciseId,
      restDurationMinutes,
      setRestDurationMinutes,
      isRunning,
      isPaused,
      isRestCountdownActive,
      resetStopEnabled,
      modelStatus,
      isModelReady,
      isCameraReady,
      isCameraInitializing,
      cameraError,
      voiceStatus,
      voiceStatusLabel: VOICE_STATUS_LABEL,
      modelStatusLabel: MODEL_STATUS_LABEL,
      start,
      pause,
      reset,
      shutdown,
    }),
    [
      exerciseId,
      restDurationMinutes,
      isRunning,
      isPaused,
      isRestCountdownActive,
      resetStopEnabled,
      modelStatus,
      isModelReady,
      isCameraReady,
      isCameraInitializing,
      cameraError,
      voiceStatus,
      start,
      pause,
      reset,
      shutdown,
    ],
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
    <WorkoutSessionChromeContext.Provider value={chromeValue}>
      <WorkoutSessionStageContext.Provider value={stageValue}>{children}</WorkoutSessionStageContext.Provider>
    </WorkoutSessionChromeContext.Provider>
  )
}

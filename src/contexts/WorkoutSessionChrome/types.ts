import type { EntityStatus, VoiceStatus } from '../../types'

export type WorkoutSessionChromeValue = {
  exerciseId: string
  setExerciseId: (id: string) => void
  restDurationMinutes: number
  setRestDurationMinutes: (minutes: number) => void
  isRunning: boolean
  isPaused: boolean
  isRestCountdownActive: boolean
  resetStopEnabled: boolean
  modelStatus: EntityStatus
  isModelReady: boolean
  isCameraReady: boolean
  isCameraInitializing: boolean
  cameraError: string | null
  voiceStatus: VoiceStatus
  voiceStatusLabel: Record<VoiceStatus, string>
  modelStatusLabel: Record<EntityStatus, string>
  start: () => Promise<void>
  pause: () => void
  reset: () => void
  shutdown: (restDurationOverrideMs?: number) => void
}

import type { EntityStatus, VoiceStatus } from '@types'

export type WorkoutSessionChromeStatusValue = {
  modelStatus: EntityStatus
  isCameraReady: boolean
  voiceStatus: VoiceStatus
  isPaused: boolean
  cameraError: string | null
}

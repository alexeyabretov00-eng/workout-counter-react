import type { EntityStatus, VoiceStatus } from '../../types'

export type WorkoutSessionChromeStatusValue = {
  modelStatus: EntityStatus
  modelStatusLabel: Record<EntityStatus, string>
  isCameraReady: boolean
  voiceStatus: VoiceStatus
  voiceStatusLabel: Record<VoiceStatus, string>
  isPaused: boolean
  cameraError: string | null
}

import { Badge, type BadgeVariant } from '../Badge'
import { WorkoutStatusBarCameraError, WorkoutStatusBarRoot } from './WorkoutStatusBar.styled'

const modelStatusToBadgeVariant = (modelStatus: string): BadgeVariant => {
  switch (modelStatus) {
    case 'ready':
      return 'success'
    case 'loading':
      return 'info'
    case 'error':
      return 'error'
    default:
      return 'neutral'
  }
}

const cameraToBadgeVariant = (isCameraReady: boolean): BadgeVariant =>
  isCameraReady ? 'success' : 'muted'

const voiceStatusToBadgeVariant = (voiceStatus: string): BadgeVariant => {
  switch (voiceStatus) {
    case 'listening':
      return 'info'
    case 'inactive-tab':
      return 'warning'
    case 'blocked':
    case 'error':
      return 'error'
    case 'unsupported':
      return 'muted'
    default:
      return 'neutral'
  }
}

export type WorkoutStatusBarProps = {
  modelStatus: string
  modelStatusLabel: string
  isCameraReady: boolean
  voiceStatus: string
  voiceStatusLabel: string
  isPaused: boolean
  cameraError: string | null
}

export const WorkoutStatusBar = ({
  modelStatus,
  modelStatusLabel,
  isCameraReady,
  voiceStatus,
  voiceStatusLabel,
  isPaused,
  cameraError,
}: WorkoutStatusBarProps) => {
  return (
    <WorkoutStatusBarRoot>
      <Badge variant={modelStatusToBadgeVariant(modelStatus)}>
        Модель: {modelStatusLabel}
      </Badge>
      <Badge variant={cameraToBadgeVariant(isCameraReady)}>
        Camera: {isCameraReady ? 'ready' : 'off'}
      </Badge>
      <Badge variant={voiceStatusToBadgeVariant(voiceStatus)}>{voiceStatusLabel}</Badge>
      {isPaused ? <Badge variant="note">Упражнение приостановлено</Badge> : null}
      {cameraError ? (
        <WorkoutStatusBarCameraError>Ошибка камеры: {cameraError}</WorkoutStatusBarCameraError>
      ) : null}
    </WorkoutStatusBarRoot>
  )
}

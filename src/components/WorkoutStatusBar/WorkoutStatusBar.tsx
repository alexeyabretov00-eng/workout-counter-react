import {
  WorkoutStatusBarCameraBadge,
  WorkoutStatusBarCameraError,
  WorkoutStatusBarModelBadge,
  WorkoutStatusBarRoot,
  WorkoutStatusBarSessionNote,
  WorkoutStatusBarVoiceBadge,
} from './WorkoutStatusBar.styled'

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
      <WorkoutStatusBarModelBadge $status={modelStatus}>
        Модель: {modelStatusLabel}
      </WorkoutStatusBarModelBadge>
      <WorkoutStatusBarCameraBadge $ready={isCameraReady}>
        Camera: {isCameraReady ? 'ready' : 'off'}
      </WorkoutStatusBarCameraBadge>
      <WorkoutStatusBarVoiceBadge $status={voiceStatus}>{voiceStatusLabel}</WorkoutStatusBarVoiceBadge>
      {isPaused ? (
        <WorkoutStatusBarSessionNote>Упражнение приостановлено</WorkoutStatusBarSessionNote>
      ) : null}
      {cameraError ? (
        <WorkoutStatusBarCameraError>Ошибка камеры: {cameraError}</WorkoutStatusBarCameraError>
      ) : null}
    </WorkoutStatusBarRoot>
  )
}

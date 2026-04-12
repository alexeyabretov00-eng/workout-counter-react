import './WorkoutStatusBar.css'

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
  const cameraModifier = isCameraReady ? 'ready' : 'off'

  return (
    <div className="workout-status-bar">
      <span className={`workout-status-bar__model workout-status-bar__model--${modelStatus}`}>
        Модель: {modelStatusLabel}
      </span>
      <span
        className={`workout-status-bar__camera workout-status-bar__camera--${cameraModifier}`}
      >
        Camera: {isCameraReady ? 'ready' : 'off'}
      </span>
      <span className={`workout-status-bar__voice workout-status-bar__voice--${voiceStatus}`}>
        {voiceStatusLabel}
      </span>
      {isPaused ? (
        <span className="workout-status-bar__session">Упражнение приостановлено</span>
      ) : null}
      {cameraError ? (
        <span className="workout-status-bar__camera-error">Ошибка камеры: {cameraError}</span>
      ) : null}
    </div>
  )
}

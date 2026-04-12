import { useStatusBarContainerSelector } from '../../logic'

export const StatusBarContainer = () => {
  const {
    modelStatus,
    modelStatusLabel,
    isCameraReady,
    voiceStatus,
    voiceStatusLabel,
    isPaused,
    cameraError,
  } = useStatusBarContainerSelector()

  return (
    <>
      <span className={`model-state ${modelStatus}`}>
        Модель: {modelStatusLabel}
      </span>
      <span className={`camera-state ${isCameraReady ? 'ready' : 'off'}`}>
        Camera: {isCameraReady ? 'ready' : 'off'}
      </span>
      <span className={`voice-state ${voiceStatus}`}>{voiceStatusLabel}</span>
      {isPaused && <span className="session-state">Упражнение приостановлено</span>}
      {cameraError && <span className="camera-error">Ошибка камеры: {cameraError}</span>}
    </>
  )
}

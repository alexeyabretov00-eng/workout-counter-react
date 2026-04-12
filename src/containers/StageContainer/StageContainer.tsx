import { useStageContainerSelector } from '../../logic'

export const StageContainer = () => {
  const { canvasRef, isCameraInitializing, isPaused } = useStageContainerSelector()

  return (
    <div className="stage-container" aria-busy={isCameraInitializing}>
      {isCameraInitializing ? (
        <div className="stage-camera-loader" role="status" aria-live="polite">
          <span className="stage-camera-loader__spinner" aria-hidden />
          <p className="stage-camera-loader__text">Подключение камеры…</p>
        </div>
      ) : null}
      {isPaused ? (
        <div className="stage-paused-state" role="status" aria-live="polite">
          <p className="stage-paused-state__text">Упражнение приостановлено</p>
        </div>
      ) : (
        <canvas ref={canvasRef} className="stage-canvas" />
      )}
    </div>
  )
}

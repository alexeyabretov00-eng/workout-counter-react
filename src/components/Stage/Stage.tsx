import type { RefObject } from 'react'
import './Stage.css'

export type StageProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>
  isCameraInitializing: boolean
  isPaused: boolean
}

export const Stage = ({ canvasRef, isCameraInitializing, isPaused }: StageProps) => {
  return (
    <div className="workout-stage">
      <div className="workout-stage__viewport" aria-busy={isCameraInitializing}>
        {isCameraInitializing ? (
          <div className="workout-stage__loader" role="status" aria-live="polite">
            <span className="workout-stage__loader-spinner" aria-hidden />
            <p className="workout-stage__loader-text">Подключение камеры…</p>
          </div>
        ) : null}
        {isPaused ? (
          <div className="workout-stage__paused" role="status" aria-live="polite">
            <p className="workout-stage__paused-text">Упражнение приостановлено</p>
          </div>
        ) : (
          <canvas ref={canvasRef} className="workout-stage__canvas" />
        )}
      </div>
    </div>
  )
}

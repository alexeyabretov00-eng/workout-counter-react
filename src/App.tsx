import { useState } from 'react'
import { useSpeechRecognition, useWorkoutSession } from './hooks'
import { exerciseRegistry } from './exercises'
import type { EntityStatus } from './types'
import './App.css'
const REST_DURATION_OPTIONS = [1, 2, 3, 5] as const

function App() {
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

  const voiceStatusLabel: Record<(typeof voiceStatus), string> = {
    unsupported: 'Голос: не поддерживается',
    starting: 'Голос: запуск',
    listening: 'Голос: слушаю',
    blocked: 'Голос: доступ к микрофону запрещен',
    error: 'Голос: ошибка распознавания',
  }
  const modelStatusLabel: Record<EntityStatus, string> = {
    idle: 'ожидание',
    initializing: 'инициализация',
    loading: 'загружается',
    ready: 'загружена',
    error: 'не загружена',
  }

  return (
    <main className="app">
      <section className="header">
        <h1>Счетчик повторений</h1>
      </section>

      <section className="controls">
        <label htmlFor="exercise-select">Упражнение</label>
        <select
          id="exercise-select"
          value={exerciseId}
          onChange={(event) => setExerciseId(event.target.value)}
          disabled={isRunning}
        >
          {exerciseRegistry.map((exercise) => (
            <option key={exercise.id} value={exercise.id}>
              {exercise.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            if (isRunning) {
              pause()
            } else {
              void start()
            }
          }}
          disabled={isRunning ? false : !isModelReady || isCameraInitializing}
          aria-label={isRunning ? 'Пауза' : 'Старт'}
        >
          {isRunning ? 'Пауза' : 'Старт'}
        </button>
        <button type="button" onClick={reset} disabled={!resetStopEnabled}>
          Сброс
        </button>
        <button
          type="button"
          onClick={() => shutdown()}
          disabled={!resetStopEnabled}
          aria-label="Стоп"
        >
          Стоп
        </button>
        <label htmlFor="rest-duration-select">Отдых</label>
        <select
          id="rest-duration-select"
          value={restDurationMinutes}
          onChange={(event) => setRestDurationMinutes(Number(event.target.value))}
        >
          {REST_DURATION_OPTIONS.map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes} мин
            </option>
          ))}
        </select>
      </section>

      <section className="status-bar">
        <span className={`model-state ${modelStatus}`}>
          Модель: {modelStatusLabel[modelStatus]}
        </span>
        <span className={`camera-state ${isCameraReady ? 'ready' : 'off'}`}>
          Camera: {isCameraReady ? 'ready' : 'off'}
        </span>
        <span className={`voice-state ${voiceStatus}`}>{voiceStatusLabel[voiceStatus]}</span>
        {isPaused && <span className="session-state">Упражнение приостановлено</span>}
        {cameraError && <span className="camera-error">Ошибка камеры: {cameraError}</span>}
      </section>

      <section className="stage" aria-busy={isCameraInitializing}>
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
      </section>
    </main>
  )
}

export default App

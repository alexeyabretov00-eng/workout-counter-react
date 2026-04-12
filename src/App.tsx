import { useState } from 'react'
import { AppLayout, Button, Select } from './components'
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
    'inactive-tab': 'Голос: переключитесь на эту вкладку',
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
    <AppLayout
      stageAriaBusy={isCameraInitializing}
      header={<h1>Счетчик повторений</h1>}
      controls={
        <>
          <Select
            id="exercise-select"
            label="Упражнение"
            value={exerciseId}
            options={exerciseRegistry.map((exercise) => ({
              value: exercise.id,
              label: exercise.name,
            }))}
            disabled={isRunning}
            onChange={setExerciseId}
          />
          <Button
            onClick={() => {
              if (isRunning) {
                pause()
              } else {
                void start()
              }
            }}
            disabled={isRunning ? false : !isModelReady || isCameraInitializing}
            ariaLabel={isRunning ? 'Пауза' : 'Старт'}
          >
            {isRunning ? 'Пауза' : 'Старт'}
          </Button>
          <Button onClick={reset} disabled={!resetStopEnabled}>
            Сброс
          </Button>
          <Button onClick={() => shutdown()} disabled={!resetStopEnabled} ariaLabel="Стоп">
            Стоп
          </Button>
          <Select
            id="rest-duration-select"
            label="Отдых"
            value={String(restDurationMinutes)}
            options={REST_DURATION_OPTIONS.map((minutes) => ({
              value: String(minutes),
              label: `${minutes} мин`,
            }))}
            onChange={(value) => setRestDurationMinutes(Number(value))}
          />
        </>
      }
      statusBar={
        <>
          <span className={`model-state ${modelStatus}`}>
            Модель: {modelStatusLabel[modelStatus]}
          </span>
          <span className={`camera-state ${isCameraReady ? 'ready' : 'off'}`}>
            Camera: {isCameraReady ? 'ready' : 'off'}
          </span>
          <span className={`voice-state ${voiceStatus}`}>{voiceStatusLabel[voiceStatus]}</span>
          {isPaused && <span className="session-state">Упражнение приостановлено</span>}
          {cameraError && <span className="camera-error">Ошибка камеры: {cameraError}</span>}
        </>
      }
      stage={
        <>
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
        </>
      }
    />
  )
}

export default App

import { Button, Select } from '../../components'
import { exerciseRegistry } from '../../exercises'
import { useExerciseControlBarContainerSelector } from '../../logic'

const REST_DURATION_OPTIONS = [1, 2, 3, 5] as const

export const ExerciseControlBarContainer = () => {
  const {
    exerciseId,
    setExerciseId,
    restDurationMinutes,
    setRestDurationMinutes,
    isRunning,
    isModelReady,
    isCameraInitializing,
    resetStopEnabled,
    start,
    pause,
    reset,
    shutdown,
  } = useExerciseControlBarContainerSelector()

  return (
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
  )
}

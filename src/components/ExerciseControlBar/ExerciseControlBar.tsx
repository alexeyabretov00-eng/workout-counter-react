import { Button } from '../Button'
import { Select } from '../Select'
import type { SelectOption } from '../Select'
import './ExerciseControlBar.css'

const REST_DURATION_OPTIONS = [1, 2, 3, 5] as const

export type ExerciseControlBarProps = {
  exerciseId: string
  exerciseOptions: SelectOption[]
  restDurationMinutes: number
  isRunning: boolean
  isModelReady: boolean
  isCameraInitializing: boolean
  resetStopEnabled: boolean
  onExerciseChange: (exerciseId: string) => void
  onStartPause: () => void
  onReset: () => void
  onShutdown: () => void
  onRestDurationChange: (minutes: number) => void
}

export const ExerciseControlBar = ({
  exerciseId,
  exerciseOptions,
  restDurationMinutes,
  isRunning,
  isModelReady,
  isCameraInitializing,
  resetStopEnabled,
  onExerciseChange,
  onStartPause,
  onReset,
  onShutdown,
  onRestDurationChange,
}: ExerciseControlBarProps) => {
  const restOptions: SelectOption[] = REST_DURATION_OPTIONS.map((minutes) => ({
    value: String(minutes),
    label: `${minutes} мин`,
  }))

  return (
    <div className="exercise-control-bar">
      <Select
        id="exercise-select"
        label="Упражнение"
        value={exerciseId}
        options={exerciseOptions}
        disabled={isRunning}
        onChange={onExerciseChange}
      />
      <Button
        onClick={onStartPause}
        disabled={isRunning ? false : !isModelReady || isCameraInitializing}
        ariaLabel={isRunning ? 'Пауза' : 'Старт'}
      >
        {isRunning ? 'Пауза' : 'Старт'}
      </Button>
      <Button onClick={onReset} disabled={!resetStopEnabled}>
        Сброс
      </Button>
      <Button onClick={onShutdown} disabled={!resetStopEnabled} ariaLabel="Стоп">
        Стоп
      </Button>
      <Select
        id="rest-duration-select"
        label="Отдых"
        value={String(restDurationMinutes)}
        options={restOptions}
        onChange={(value) => onRestDurationChange(Number(value))}
      />
    </div>
  )
}

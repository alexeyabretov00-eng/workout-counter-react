import { Button } from '../Button'
import { Select } from '../Select'
import type { SelectOption } from '../Select'
import './ExerciseControlBar.css'

export type ExerciseControlBarProps = {
  exerciseId: string
  exerciseOptions: SelectOption[]
  restDurationMinutes: number
  restDurationOptions: SelectOption[]
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
  restDurationOptions,
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
        options={restDurationOptions}
        onChange={(value) => onRestDurationChange(Number(value))}
      />
    </div>
  )
}

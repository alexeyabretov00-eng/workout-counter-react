import { ExerciseControlBar } from '../../components'
import { exerciseRegistry } from '../../exercises'
import { useExerciseControlBarContainerSelector } from '../../logic'

export const ExerciseControlBarContainer = () => {
  const {
    exerciseId,
    restDurationMinutes,
    restDurationOptions,
    isRunning,
    isModelReady,
    isCameraInitializing,
    resetStopEnabled,
    dispatchChromeControl,
  } = useExerciseControlBarContainerSelector()

  const exerciseOptions = exerciseRegistry.map((exercise) => ({
    value: exercise.id,
    label: exercise.name,
  }))

  return (
    <ExerciseControlBar
      exerciseId={exerciseId}
      exerciseOptions={exerciseOptions}
      restDurationMinutes={restDurationMinutes}
      restDurationOptions={restDurationOptions}
      isRunning={isRunning}
      isModelReady={isModelReady}
      isCameraInitializing={isCameraInitializing}
      resetStopEnabled={resetStopEnabled}
      onExerciseChange={(id) => dispatchChromeControl({ type: 'setExerciseId', exerciseId: id })}
      onStartPause={() => {
        if (isRunning) {
          dispatchChromeControl({ type: 'pause' })
        } else {
          dispatchChromeControl({ type: 'start' })
        }
      }}
      onReset={() => dispatchChromeControl({ type: 'reset' })}
      onShutdown={() => dispatchChromeControl({ type: 'shutdown' })}
      onRestDurationChange={(minutes) =>
        dispatchChromeControl({ type: 'setRestDurationMinutes', minutes })
      }
    />
  )
}

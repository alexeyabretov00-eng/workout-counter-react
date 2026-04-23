import { useAppDispatch, useAppSelector } from '@store';
import { eventBus } from '@utils';

import { ExerciseControlBar } from '../../components';
import { EVENT_WORKOUT_SESSION_CONTROLS_COMMAND } from '../../constants';
import { exerciseRegistry } from '../../exercises';
import { getExerciseControlBarContainerProps } from '../../selectors';
import { updateHomeModuleState } from '../../store';

export const ExerciseControlBarContainer = () => {
  const {
    exerciseId,
    restDurationMinutes,
    restDurationOptions,
    isRunning,
    isModelReady,
    isCameraInitializing,
    resetStopEnabled,
  } = useAppSelector(getExerciseControlBarContainerProps);
  const dispatch = useAppDispatch();

  const exerciseOptions = exerciseRegistry.map(exercise => ({
    value: exercise.id,
    label: exercise.name,
  }));

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
      onExerciseChange={id => dispatch(updateHomeModuleState({ exerciseId: id }))}
      onStartPause={() =>
        eventBus.emit(EVENT_WORKOUT_SESSION_CONTROLS_COMMAND, {
          type: isRunning ? 'pause' : 'start',
        })
      }
      onReset={() => eventBus.emit(EVENT_WORKOUT_SESSION_CONTROLS_COMMAND, { type: 'reset' })}
      onShutdown={() => eventBus.emit(EVENT_WORKOUT_SESSION_CONTROLS_COMMAND, { type: 'shutdown' })}
      onRestDurationChange={minutes =>
        dispatch(updateHomeModuleState({ restDurationMinutes: minutes }))
      }
    />
  );
};

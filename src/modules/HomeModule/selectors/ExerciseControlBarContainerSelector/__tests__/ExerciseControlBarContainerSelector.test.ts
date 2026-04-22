import { describe, expect, test } from 'vitest';

import { initialWorkoutSessionControlsState, setupStore } from '@store';

import { getExerciseControlBarContainerProps } from '../ExerciseControlBarContainerSelector';

describe('getExerciseControlBarContainerProps', () => {
  test('maps workout session controls to exercise control bar model', () => {
    const store = setupStore({
      workoutSessionControls: {
        ...initialWorkoutSessionControlsState,
        exerciseId: 'biceps-curl',
        restDurationMinutes: 2,
        isRunning: true,
        resetStopEnabled: true,
        isModelReady: true,
        isCameraInitializing: false,
      },
    });

    expect(getExerciseControlBarContainerProps(store.getState())).toEqual({
      exerciseId: 'biceps-curl',
      restDurationMinutes: 2,
      restDurationOptions: [
        { value: '1', label: '1 мин' },
        { value: '2', label: '2 мин' },
        { value: '3', label: '3 мин' },
        { value: '5', label: '5 мин' },
      ],
      isRunning: true,
      isModelReady: true,
      isCameraInitializing: false,
      resetStopEnabled: true,
    });
  });
});

import type { SelectOption } from '@components';
import { createSelector } from '@reduxjs/toolkit';

import { selectWorkoutSessionControls } from '@store';

const REST_DURATION_MINUTES = [1, 2, 3, 5] as const;

const REST_DURATION_OPTIONS: SelectOption[] = REST_DURATION_MINUTES.map(minutes => ({
  value: String(minutes),
  label: `${minutes} мин`,
}));

export const getExerciseControlBarContainerProps = createSelector(
  [selectWorkoutSessionControls],
  controls => ({
    exerciseId: controls.exerciseId,
    restDurationMinutes: controls.restDurationMinutes,
    restDurationOptions: REST_DURATION_OPTIONS,
    isRunning: controls.isRunning,
    isModelReady: controls.isModelReady,
    isCameraInitializing: controls.isCameraInitializing,
    resetStopEnabled: controls.resetStopEnabled,
  }),
);

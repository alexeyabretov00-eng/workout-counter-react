import type { WorkoutSessionControlsState } from './types';

type WorkoutSessionControlsSliceState = { workoutSessionControls: WorkoutSessionControlsState };

export const selectWorkoutSessionControls = (state: WorkoutSessionControlsSliceState) =>
  state.workoutSessionControls;

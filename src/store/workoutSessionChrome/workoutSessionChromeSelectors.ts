import type { WorkoutSessionChromeState } from './types';

type WorkoutSessionChromeSliceState = { workoutSessionChrome: WorkoutSessionChromeState };

export const selectWorkoutSessionChrome = (state: WorkoutSessionChromeSliceState) =>
  state.workoutSessionChrome;

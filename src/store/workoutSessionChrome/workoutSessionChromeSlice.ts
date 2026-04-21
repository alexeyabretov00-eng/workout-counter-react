import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { WorkoutSessionChromeState } from './types';

export const initialWorkoutSessionChromeState: WorkoutSessionChromeState = {
  modelStatus: 'idle',
  isCameraReady: false,
  voiceStatus: 'unsupported',
  isPaused: false,
  cameraError: null,
};

export const workoutSessionChromeSlice = createSlice({
  name: 'workoutSessionChrome',
  initialState: initialWorkoutSessionChromeState,
  reducers: {
    setWorkoutSessionChrome: (_state, action: PayloadAction<WorkoutSessionChromeState>) => {
      return action.payload;
    },
    resetWorkoutSessionChrome: () => {
      return initialWorkoutSessionChromeState;
    },
  },
});

export const { setWorkoutSessionChrome, resetWorkoutSessionChrome } =
  workoutSessionChromeSlice.actions;

export const workoutSessionChromeReducer = workoutSessionChromeSlice.reducer;

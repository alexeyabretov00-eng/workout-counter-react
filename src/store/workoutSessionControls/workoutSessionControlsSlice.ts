import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type WorkoutSessionControlsState } from './types';

export const initialWorkoutSessionControlsState: WorkoutSessionControlsState = {
  modelStatus: 'idle',
  isCameraReady: false,
  voiceStatus: 'unsupported',
  isPaused: false,
  cameraError: null,
  exerciseId: 'army-press',
  restDurationMinutes: 3,
  isRunning: false,
  resetStopEnabled: false,
  isModelReady: false,
  isCameraInitializing: true,
};

export const workoutSessionControlsSlice = createSlice({
  name: 'workoutSessionControls',
  initialState: initialWorkoutSessionControlsState,
  reducers: {
    setWorkoutSessionControls: (_state, action: PayloadAction<WorkoutSessionControlsState>) => {
      return action.payload;
    },
    patchWorkoutSessionControls: (
      state,
      action: PayloadAction<Partial<WorkoutSessionControlsState>>,
    ) => {
      Object.assign(state, action.payload);
    },
    resetWorkoutSessionControls: () => {
      return initialWorkoutSessionControlsState;
    },
  },
});

export const {
  patchWorkoutSessionControls,
  setWorkoutSessionControls,
  resetWorkoutSessionControls,
} = workoutSessionControlsSlice.actions;

export const workoutSessionControlsReducer = workoutSessionControlsSlice.reducer;

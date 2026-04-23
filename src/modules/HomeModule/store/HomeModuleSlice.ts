import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type HomeModuleState } from './types';

export const initialHomeModuleState: HomeModuleState = {
  modelStatus: 'idle',
  cameraStatus: 'idle',
  cameraError: null,
  voiceStatus: 'unsupported',
  isPaused: false,
  exerciseId: 'army-press',
  restDurationMinutes: 3,
  isRunning: false,
  resetStopEnabled: false,
  isModelReady: false,
};

export const HomeModuleSlice = createSlice({
  name: 'HomeModuleSlice',
  initialState: initialHomeModuleState,
  reducers: {
    updateHomeModuleState: (state, action: PayloadAction<Partial<HomeModuleState>>) => {
      Object.assign(state, action.payload);
    },
    resetHomeModuleState: () => {
      return initialHomeModuleState;
    },
  },
});

export const { updateHomeModuleState, resetHomeModuleState } = HomeModuleSlice.actions;

export const HomeModuleReducer = HomeModuleSlice.reducer;

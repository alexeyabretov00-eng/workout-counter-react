import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type HomeModuleState } from './types';

export const initialHomeModuleState: HomeModuleState = {
  modelStatus: 'idle',
  cameraStatus: 'idle',
  sessionStatus: 'idle',
  cameraError: null,
  voiceStatus: 'unsupported',
  exerciseId: 'army-press',
  restDurationMinutes: 3,
  resetStopEnabled: false,
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

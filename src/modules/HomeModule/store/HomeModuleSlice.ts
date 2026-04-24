import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { fetchExerciseCatalog } from './HomeModuleThunks';
import { type HomeModuleState } from './types';

export const initialHomeModuleState: HomeModuleState = {
  modelStatus: 'idle',
  modelLoadingProgress: null,
  cameraStatus: 'idle',
  sessionStatus: 'idle',
  cameraError: null,
  voiceStatus: 'unsupported',
  exerciseId: '',
  exerciseCatalogEntries: [],
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
  extraReducers: builder => {
    builder.addCase(fetchExerciseCatalog.fulfilled, (state, action) => {
      if (action.payload.length) {
        state.exerciseCatalogEntries = action.payload;
      }
    });
  },
});

export const { updateHomeModuleState, resetHomeModuleState } = HomeModuleSlice.actions;

export const HomeModuleReducer = HomeModuleSlice.reducer;

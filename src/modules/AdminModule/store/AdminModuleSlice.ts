import { createSlice } from '@reduxjs/toolkit';

import {
  archiveAdminExercise,
  createAdminExercise,
  fetchAdminExercises,
  updateAdminExercise,
} from './AdminModuleThunks';
import type { AdminModuleState } from './types';

export const initialAdminModuleState: AdminModuleState = {
  exercises: [],
  isLoading: false,
  isSubmitting: false,
};

export const AdminModuleSlice = createSlice({
  name: 'AdminModuleSlice',
  initialState: initialAdminModuleState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAdminExercises.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchAdminExercises.fulfilled, (state, action) => {
        state.exercises = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAdminExercises.rejected, state => {
        state.isLoading = false;
      })
      .addCase(createAdminExercise.pending, state => {
        state.isSubmitting = true;
      })
      .addCase(createAdminExercise.fulfilled, (state, action) => {
        state.exercises = action.payload;
        state.isSubmitting = false;
      })
      .addCase(createAdminExercise.rejected, state => {
        state.isSubmitting = false;
      })
      .addCase(updateAdminExercise.pending, state => {
        state.isSubmitting = true;
      })
      .addCase(updateAdminExercise.fulfilled, (state, action) => {
        state.exercises = action.payload;
        state.isSubmitting = false;
      })
      .addCase(updateAdminExercise.rejected, state => {
        state.isSubmitting = false;
      })
      .addCase(archiveAdminExercise.pending, state => {
        state.isSubmitting = true;
      })
      .addCase(archiveAdminExercise.fulfilled, (state, action) => {
        state.exercises = action.payload;
        state.isSubmitting = false;
      })
      .addCase(archiveAdminExercise.rejected, state => {
        state.isSubmitting = false;
      });
  },
});

export const AdminModuleReducer = AdminModuleSlice.reducer;

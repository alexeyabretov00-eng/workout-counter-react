import { createSlice } from '@reduxjs/toolkit';

import {
  archiveAdminExercise,
  createAdminExercise,
  createAdminExerciseSet,
  deleteAdminExerciseSet,
  fetchAdminExercises,
  fetchAdminExerciseSets,
  fetchAssignableUsers,
  fetchPublicExercises,
  updateAdminExercise,
  updateAdminExerciseSet,
} from './AdminModuleThunks';
import type { AdminModuleState } from './types';

export const initialAdminModuleState: AdminModuleState = {
  exercises: [],
  exerciseSets: [],
  assignableUsers: [],
  isLoading: false,
  isSetsLoading: false,
  isSubmitting: false,
  isSetSubmitting: false,
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
      .addCase(fetchPublicExercises.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchPublicExercises.fulfilled, (state, action) => {
        state.exercises = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPublicExercises.rejected, state => {
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
      })
      .addCase(fetchAdminExerciseSets.pending, state => {
        state.isSetsLoading = true;
      })
      .addCase(fetchAdminExerciseSets.fulfilled, (state, action) => {
        state.exerciseSets = action.payload;
        state.isSetsLoading = false;
      })
      .addCase(fetchAdminExerciseSets.rejected, state => {
        state.isSetsLoading = false;
      })
      .addCase(fetchAssignableUsers.fulfilled, (state, action) => {
        state.assignableUsers = action.payload;
      })
      .addCase(createAdminExerciseSet.pending, state => {
        state.isSetSubmitting = true;
      })
      .addCase(createAdminExerciseSet.fulfilled, (state, action) => {
        state.exerciseSets = action.payload;
        state.isSetSubmitting = false;
      })
      .addCase(createAdminExerciseSet.rejected, state => {
        state.isSetSubmitting = false;
      })
      .addCase(updateAdminExerciseSet.pending, state => {
        state.isSetSubmitting = true;
      })
      .addCase(updateAdminExerciseSet.fulfilled, (state, action) => {
        state.exerciseSets = action.payload;
        state.isSetSubmitting = false;
      })
      .addCase(updateAdminExerciseSet.rejected, state => {
        state.isSetSubmitting = false;
      })
      .addCase(deleteAdminExerciseSet.pending, state => {
        state.isSetSubmitting = true;
      })
      .addCase(deleteAdminExerciseSet.fulfilled, (state, action) => {
        state.exerciseSets = action.payload;
        state.isSetSubmitting = false;
      })
      .addCase(deleteAdminExerciseSet.rejected, state => {
        state.isSetSubmitting = false;
      });
  },
});

export const AdminModuleReducer = AdminModuleSlice.reducer;

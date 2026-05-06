import { createSelector } from '@reduxjs/toolkit';

import type { AdminModuleState } from '../store';

type AdminModuleSliceState = { admin: AdminModuleState };

export const getAdminModuleState = (state: AdminModuleSliceState) => state.admin;

export const getAdminModuleProps = createSelector([getAdminModuleState], admin => ({
  exercises: admin.exercises,
  exerciseSets: admin.exerciseSets,
  assignableUsers: admin.assignableUsers,
  isLoading: admin.isLoading,
  isSetsLoading: admin.isSetsLoading,
  isSubmitting: admin.isSubmitting,
  isSetSubmitting: admin.isSetSubmitting,
}));

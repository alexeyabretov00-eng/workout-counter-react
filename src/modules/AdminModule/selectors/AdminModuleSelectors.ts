import { createSelector } from '@reduxjs/toolkit';

import { type AdminModuleState, initialAdminModuleState } from '../store';

type AdminModuleSliceState = { admin?: AdminModuleState };

export const getAdminModuleState = (state: AdminModuleSliceState) =>
  state.admin ?? initialAdminModuleState;

export const getAdminModuleProps = createSelector([getAdminModuleState], admin => ({
  exercises: admin.exercises,
  isLoading: admin.isLoading,
  isSubmitting: admin.isSubmitting,
}));

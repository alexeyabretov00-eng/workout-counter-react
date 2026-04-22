import { createSelector } from '@reduxjs/toolkit';

import { selectAuthStatus, selectAuthUser } from '@store';

export const selectRegistrationModuleAuth = createSelector(
  [selectAuthUser, selectAuthStatus],
  (user, status) => ({ user, isLoading: status === 'loading' }),
);

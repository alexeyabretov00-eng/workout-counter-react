import { createSelector } from '@reduxjs/toolkit';
import type { AuthUser } from '@store';
import type { LoadingReadyStatus } from '@types';

import { selectAuthStatus, selectAuthUser } from '@store';

export type RegistrationModuleAuthModel = {
  user: AuthUser | null;
  status: LoadingReadyStatus;
};

export const selectRegistrationModuleAuth = createSelector(
  [selectAuthUser, selectAuthStatus],
  (user, status): RegistrationModuleAuthModel => ({ user, status }),
);

import { createSelector } from '@reduxjs/toolkit';
import type { AuthUser } from '@store';
import type { LoadingReadyStatus } from '@types';

import { selectAuthStatus, selectAuthUser } from '@store';

export type LoginModuleAuthModel = {
  user: AuthUser | null;
  status: LoadingReadyStatus;
};

export const selectLoginModuleAuth = createSelector(
  [selectAuthUser, selectAuthStatus],
  (user, status): LoginModuleAuthModel => ({ user, status }),
);

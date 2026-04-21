import { createSelector } from '@reduxjs/toolkit';
import type { AuthUser } from '@store';
import type { LoadingReadyStatus } from '@types';

import { selectAuthStatus, selectAuthUser } from '@store';

export type RequireAuthGateModel = {
  user: AuthUser | null;
  status: LoadingReadyStatus;
};

export const selectRequireAuthGate = createSelector(
  [selectAuthUser, selectAuthStatus],
  (user, status): RequireAuthGateModel => ({ user, status }),
);

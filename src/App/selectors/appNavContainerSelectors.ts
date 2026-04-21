import { createSelector } from '@reduxjs/toolkit';
import type { LoadingReadyStatus } from '@types';

import { selectAuthStatus, selectAuthUser } from '@store';

export type AppNavContainerSessionModel = {
  sessionStatus: LoadingReadyStatus;
  navUser: { login: string } | null;
};

export const selectAppNavContainerSession = createSelector(
  [selectAuthUser, selectAuthStatus],
  (user, status): AppNavContainerSessionModel => ({
    sessionStatus: status,
    navUser: user ? { login: user.login } : null,
  }),
);

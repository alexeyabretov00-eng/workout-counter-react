import { createSelector } from '@reduxjs/toolkit';

import { selectAuthMustChangePassword, selectAuthStatus, selectAuthUser } from '@store';

export const getAppNavContainerProps = createSelector(
  [selectAuthUser, selectAuthStatus],
  (user, status) => ({
    isLoading: status === 'loading',
    user: user ? { login: user.login, role: user.role } : null,
  }),
);

export const getRequireAuthProps = createSelector(
  [selectAuthUser, selectAuthStatus, selectAuthMustChangePassword],
  (user, status, mustChangePassword) => ({
    user,
    role: user?.role ?? null,
    mustChangePassword,
    isLoading: status === 'loading',
  }),
);

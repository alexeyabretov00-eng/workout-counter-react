import { createSelector } from '@reduxjs/toolkit';

import { selectAuthStatus, selectAuthUser } from '@store';

export const getAppNavContainerProps = createSelector(
  [selectAuthUser, selectAuthStatus],
  (user, status) => ({
    isLoading: status === 'loading',
    user: user ? { login: user.login } : null,
  }),
);

export const getRequireAuthProps = createSelector(
  [selectAuthUser, selectAuthStatus],
  (user, status) => ({ user, isLoading: status === 'loading' }),
);

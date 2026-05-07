import { createSelector } from '@reduxjs/toolkit';

import { initialAuthState } from './authSlice';
import type { AuthState } from './types';

type AuthSliceState = { auth?: AuthState };

export const getAuthState = (state: AuthSliceState) => state.auth ?? initialAuthState;

export const selectAuthUser = createSelector([getAuthState], state => state.user);
export const selectAuthStatus = createSelector([getAuthState], state => state.status);
export const selectAuthRole = createSelector([getAuthState], state => state.user?.role ?? null);
export const selectAuthMustChangePassword = createSelector(
  [getAuthState],
  state => state.user?.mustChangePassword ?? false,
);

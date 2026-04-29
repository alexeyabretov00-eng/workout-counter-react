import type { AuthState } from './types';

type AuthSliceState = { auth: AuthState };

/** Поля среза `auth` — для общего использования и внутри комбинированных селекторов. */
export const selectAuthUser = (state: AuthSliceState) => state.auth.user;

export const selectAuthStatus = (state: AuthSliceState) => state.auth.status;

export const selectAuthRole = (state: AuthSliceState) => state.auth.user?.role ?? null;

export const selectAuthMustChangePassword = (state: AuthSliceState) =>
  state.auth.user?.mustChangePassword ?? false;

import type { AuthState } from './types';

type AuthSliceState = { auth: AuthState };

/** Поля среза `auth` — для общего использования и внутри комбинированных селекторов. */
export const selectAuthUser = (state: AuthSliceState) => state.auth.user;

export const selectAuthStatus = (state: AuthSliceState) => state.auth.status;

/* eslint-disable simple-import-sort/exports -- базовые селекторы в конце: иначе при обходе barrel `selectAuth*` до инициализации slice/thunks. */
export { authReducer, authSlice } from './authSlice';
export {
  initializeAuth,
  loginWithPassword,
  logout,
  refreshSession,
  registerWithPassword,
} from './authThunks';
export type { AuthState, AuthUser } from './types';
export { selectAuthStatus, selectAuthUser } from './authSelectors';

/* eslint-disable simple-import-sort/exports -- базовые селекторы в конце: иначе при обходе barrel `selectAuth*` до инициализации slice/thunks. */
export { authReducer } from './authSlice';
export {
  changePassword,
  initializeAuth,
  loginWithPassword,
  logout,
  registerWithPassword,
} from './authThunks';
export type { AuthState, AuthUser } from './types';
export {
  selectAuthMustChangePassword,
  selectAuthRole,
  selectAuthStatus,
  selectAuthUser,
} from './authSelectors';

import type { LoadingReadyStatus } from '@types';

export type AuthUser = {
  id: number;
  login: string;
};

export type AuthState = {
  user: AuthUser | null;
  /** Состояние восстановления сессии (`/api/me`) — то же семейство, что и `LoadingReadyStatus`. */
  status: LoadingReadyStatus;
};

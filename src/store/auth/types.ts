import type { LoadingReadyStatus } from '@types';

export type AuthUser = {
  id: number;
  login: string;
  role: 'user' | 'admin' | 'superadmin';
  mustChangePassword: boolean;
};

export type AuthState = {
  user: AuthUser | null;
  /** Состояние восстановления сессии (`/api/me`) — то же семейство, что и `LoadingReadyStatus`. */
  status: LoadingReadyStatus;
};

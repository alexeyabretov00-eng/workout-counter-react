export type AuthUser = {
  id: number;
  login: string;
};

export type AuthSessionStatus = 'loading' | 'ready';

export type AuthSessionValue = {
  user: AuthUser | null;
  status: AuthSessionStatus;
  loginWithPassword: (login: string, password: string) => Promise<void>;
  registerWithPassword: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

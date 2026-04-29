export type UserRole = 'user' | 'admin' | 'superadmin';

export type ManagedUserTableRow = {
  id: number;
  login: string;
  role: UserRole;
  mustChangePassword: boolean;
  createdAt: string;
};

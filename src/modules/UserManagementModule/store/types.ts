export type UserRole = 'user' | 'admin' | 'superadmin';

export type ManagedUser = {
  id: number;
  login: string;
  role: UserRole;
  mustChangePassword: boolean;
  createdAt: string;
};

export type UserManagementModuleState = {
  users: ManagedUser[];
  isLoading: boolean;
  error: string | null;
  isUpdatingByUserId: Record<number, boolean>;
};

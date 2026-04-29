import { ApiJsonClient } from '@utils';

type UserRole = 'user' | 'admin' | 'superadmin';

export type ManagedUserDto = {
  id: number;
  login: string;
  role: UserRole;
  mustChangePassword: boolean;
  createdAt: string;
};

class UserManagementClient extends ApiJsonClient {
  async listUsers(): Promise<{ users: ManagedUserDto[] }> {
    return this.request('/admin/users', { method: 'GET' });
  }

  async updateUserRole(id: number, role: UserRole): Promise<{ user: ManagedUserDto }> {
    return this.request(`/admin/users/${id}`, {
      method: 'PATCH',
      jsonBody: { role },
    });
  }

  async resetUserPassword(id: number): Promise<{ user: ManagedUserDto }> {
    return this.request(`/admin/users/${id}/reset-password`, {
      method: 'POST',
      jsonBody: {},
    });
  }
}

export const userManagementClient = new UserManagementClient();

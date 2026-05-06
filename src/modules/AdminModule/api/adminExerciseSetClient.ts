import { ApiJsonClient } from '@utils';

import type { ExerciseSetDto } from './exerciseSetTypes';

export type AssignableUserDto = {
  id: number;
  login: string;
  role: 'user' | 'admin' | 'superadmin';
  mustChangePassword: boolean;
  createdAt: string;
};

class AdminExerciseSetClient extends ApiJsonClient {
  async list(): Promise<{ sets: ExerciseSetDto[] }> {
    return this.request('/admin/exercise-sets', { method: 'GET' });
  }

  async create(input: {
    name: string;
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    exerciseIds: number[];
    userId?: number;
  }): Promise<{ set: ExerciseSetDto }> {
    return this.request('/admin/exercise-sets', {
      method: 'POST',
      jsonBody: input,
    });
  }

  async update(
    id: number,
    input: {
      name: string;
      dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
      exerciseIds: number[];
      userId?: number;
    },
  ): Promise<{ set: ExerciseSetDto }> {
    return this.request(`/admin/exercise-sets/${String(id)}`, {
      method: 'PATCH',
      jsonBody: input,
    });
  }

  async listAssignableUsers(): Promise<{ users: AssignableUserDto[] }> {
    return this.request('/admin/exercise-sets/assignable-users', { method: 'GET' });
  }

  async delete(id: number): Promise<void> {
    await this.request<{ ok: boolean }>(`/admin/exercise-sets/${String(id)}`, {
      method: 'DELETE',
    });
  }
}

export const adminExerciseSetClient = new AdminExerciseSetClient();

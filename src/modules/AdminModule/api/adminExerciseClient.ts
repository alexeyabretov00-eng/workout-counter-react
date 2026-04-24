import type { ExerciseDto } from '@api';

import { ApiJsonClient } from '@utils';

class AdminExerciseClient extends ApiJsonClient {
  async list(): Promise<{ exercises: ExerciseDto[] }> {
    return this.request('/admin/exercises', { method: 'GET' });
  }

  async create(input: {
    slug: string;
    name: string;
    description: string;
    detectorKey: string;
    voiceAliases: string[];
    sortOrder: number;
    isActive: boolean;
  }): Promise<{ exercise: ExerciseDto }> {
    return this.request('/admin/exercises', {
      method: 'POST',
      jsonBody: input,
    });
  }

  async update(
    id: number,
    input: Partial<{
      slug: string;
      name: string;
      description: string;
      detectorKey: string;
      voiceAliases: string[];
      sortOrder: number;
      isActive: boolean;
    }>,
  ): Promise<{ exercise: ExerciseDto }> {
    return this.request(`/admin/exercises/${String(id)}`, {
      method: 'PATCH',
      jsonBody: input,
    });
  }

  async archive(id: number): Promise<void> {
    await this.request<{ ok: boolean }>(`/admin/exercises/${String(id)}`, {
      method: 'DELETE',
    });
  }
}

export const adminExerciseClient = new AdminExerciseClient();

import { ApiJsonClient } from '@utils';

export type ExerciseDto = {
  id: number;
  slug: string;
  name: string;
  description: string;
  detectorKey: string;
  voiceAliases: string[];
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

class ExerciseClient extends ApiJsonClient {
  async list(): Promise<{ exercises: ExerciseDto[] }> {
    return this.request('/exercises', { method: 'GET' });
  }
}

export const exerciseClient = new ExerciseClient();

import type { ExerciseDto } from '@api';

import { ApiJsonClient } from '@utils';

class ExerciseClient extends ApiJsonClient {
  async list(): Promise<{ exercises: ExerciseDto[] }> {
    return this.request('/exercises', { method: 'GET' });
  }
}

export const exerciseClient = new ExerciseClient();

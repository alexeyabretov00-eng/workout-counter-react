import { beforeEach, describe, expect, test, vi } from 'vitest';

import { setupStore } from '@store';

vi.mock('../../api', () => ({
  adminExerciseClient: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    archive: vi.fn(),
  },
}));

vi.mock('@api', async importOriginal => {
  const actual = await importOriginal<typeof import('@api')>();
  return {
    ...actual,
  };
});

import type { ExerciseDto } from '@api';

import { adminExerciseClient } from '../../api';
import {
  archiveAdminExercise,
  createAdminExercise,
  fetchAdminExercises,
  updateAdminExercise,
} from '../index';

const EXERCISE_FIXTURE: ExerciseDto = {
  id: 1,
  slug: 'biceps-curl',
  name: 'Подъем на бицепс',
  description: 'desc',
  detectorKey: 'biceps-curl',
  voiceAliases: ['бицепс'],
  sortOrder: 10,
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('admin thunks (store + mocked module api)', () => {
  beforeEach(() => {
    vi.mocked(adminExerciseClient.list).mockReset();
    vi.mocked(adminExerciseClient.create).mockReset();
    vi.mocked(adminExerciseClient.update).mockReset();
    vi.mocked(adminExerciseClient.archive).mockReset();
  });

  test('fetchAdminExercises loads exercises to admin state', async () => {
    vi.mocked(adminExerciseClient.list).mockResolvedValue({ exercises: [EXERCISE_FIXTURE] });
    const store = setupStore();

    await store.dispatch(fetchAdminExercises());

    expect(store.getState().admin.exercises).toEqual([EXERCISE_FIXTURE]);
    expect(store.getState().admin.isLoading).toBe(false);
  });

  test('createAdminExercise creates and refreshes list', async () => {
    vi.mocked(adminExerciseClient.create).mockResolvedValue({ exercise: EXERCISE_FIXTURE });
    vi.mocked(adminExerciseClient.list).mockResolvedValue({ exercises: [EXERCISE_FIXTURE] });
    const store = setupStore();

    await store.dispatch(
      createAdminExercise({
        slug: 'biceps-curl',
        name: 'Подъем на бицепс',
        description: 'desc',
        detectorKey: 'biceps-curl',
        voiceAliases: 'бицепс,сгибание рук',
        sortOrder: 10,
        isActive: true,
      }),
    );

    expect(adminExerciseClient.create).toHaveBeenCalledTimes(1);
    expect(adminExerciseClient.list).toHaveBeenCalledTimes(1);
    expect(store.getState().admin.exercises).toEqual([EXERCISE_FIXTURE]);
    expect(store.getState().admin.isSubmitting).toBe(false);
  });

  test('updateAdminExercise updates and refreshes list', async () => {
    vi.mocked(adminExerciseClient.update).mockResolvedValue({ exercise: EXERCISE_FIXTURE });
    vi.mocked(adminExerciseClient.list).mockResolvedValue({ exercises: [EXERCISE_FIXTURE] });
    const store = setupStore();

    await store.dispatch(
      updateAdminExercise({
        id: 1,
        values: {
          slug: 'biceps-curl',
          name: 'Подъем на бицепс',
          description: 'desc',
          detectorKey: 'biceps-curl',
          voiceAliases: 'бицепс',
          sortOrder: 10,
          isActive: true,
        },
      }),
    );

    expect(adminExerciseClient.update).toHaveBeenCalledTimes(1);
    expect(adminExerciseClient.list).toHaveBeenCalledTimes(1);
    expect(store.getState().admin.exercises).toEqual([EXERCISE_FIXTURE]);
  });

  test('archiveAdminExercise archives and refreshes list', async () => {
    vi.mocked(adminExerciseClient.archive).mockResolvedValue(undefined);
    vi.mocked(adminExerciseClient.list).mockResolvedValue({ exercises: [] });
    const store = setupStore({
      admin: {
        exercises: [EXERCISE_FIXTURE],
        isLoading: false,
        isSubmitting: false,
      },
    });

    await store.dispatch(archiveAdminExercise(1));

    expect(adminExerciseClient.archive).toHaveBeenCalledWith(1);
    expect(adminExerciseClient.list).toHaveBeenCalledTimes(1);
    expect(store.getState().admin.exercises).toEqual([]);
  });
});

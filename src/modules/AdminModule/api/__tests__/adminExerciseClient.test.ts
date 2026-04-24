import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { adminExerciseClient } from '../adminExerciseClient';

const jsonResponse = (body: unknown, init?: ResponseInit) => {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
};

describe('adminExerciseClient', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          jsonResponse({
            exercises: [],
          }),
        ),
      ),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test('list calls fetch with GET and /api/admin/exercises', async () => {
    await adminExerciseClient.list();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      '/api/admin/exercises',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      }),
    );
  });

  test('create calls fetch with POST and JSON body', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        exercise: {
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
        },
      }),
    );

    await adminExerciseClient.create({
      slug: 'biceps-curl',
      name: 'Подъем на бицепс',
      description: 'desc',
      detectorKey: 'biceps-curl',
      voiceAliases: ['бицепс'],
      sortOrder: 10,
      isActive: true,
    });

    expect(fetch).toHaveBeenCalledWith(
      '/api/admin/exercises',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'biceps-curl',
          name: 'Подъем на бицепс',
          description: 'desc',
          detectorKey: 'biceps-curl',
          voiceAliases: ['бицепс'],
          sortOrder: 10,
          isActive: true,
        }),
      }),
    );
  });

  test('update calls fetch with PATCH and id in URL', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        exercise: {
          id: 1,
          slug: 'biceps-curl',
          name: 'Подъем на бицепс',
          description: 'desc',
          detectorKey: 'biceps-curl',
          voiceAliases: ['бицепс'],
          sortOrder: 20,
          isActive: true,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      }),
    );

    await adminExerciseClient.update(1, { sortOrder: 20 });

    expect(fetch).toHaveBeenCalledWith(
      '/api/admin/exercises/1',
      expect.objectContaining({
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortOrder: 20 }),
      }),
    );
  });

  test('archive calls fetch with DELETE and id in URL', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ ok: true }));

    await adminExerciseClient.archive(7);

    expect(fetch).toHaveBeenCalledWith(
      '/api/admin/exercises/7',
      expect.objectContaining({
        method: 'DELETE',
        credentials: 'include',
      }),
    );
  });

  test('throws ApiRequestError on API error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ error: { code: 'BAD', message: 'oops' } }, { status: 400 }),
    );

    await expect(adminExerciseClient.list()).rejects.toMatchObject({
      code: 'BAD',
      message: 'oops',
    });
  });
});

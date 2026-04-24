import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { exerciseClient } from '../exerciseClient';

const jsonResponse = (body: unknown, init?: ResponseInit) => {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
};

describe('exerciseClient', () => {
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

  test('list calls fetch with GET, credentials and /api/exercises', async () => {
    await exerciseClient.list();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      '/api/exercises',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      }),
    );
  });

  test('list returns exercises payload on success', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        exercises: [
          {
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
        ],
      }),
    );

    await expect(exerciseClient.list()).resolves.toEqual({
      exercises: [
        {
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
      ],
    });
  });

  test('list throws ApiRequestError on API error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ error: { code: 'BAD', message: 'oops' } }, { status: 400 }),
    );

    await expect(exerciseClient.list()).rejects.toMatchObject({
      code: 'BAD',
      message: 'oops',
    });
  });
});

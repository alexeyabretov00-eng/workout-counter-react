import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { userManagementClient } from '../userManagementClient';

const jsonResponse = (body: unknown, init?: ResponseInit) => {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
};

describe('userManagementClient', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          jsonResponse({
            users: [],
          }),
        ),
      ),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test('listUsers calls fetch with GET and /api/admin/users', async () => {
    await userManagementClient.listUsers();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      '/api/admin/users',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      }),
    );
  });

  test('updateUserRole calls fetch with PATCH and role in JSON body', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({
        user: {
          id: 5,
          login: 'alex',
          role: 'admin',
          mustChangePassword: false,
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      }),
    );

    await userManagementClient.updateUserRole(5, 'admin');

    expect(fetch).toHaveBeenCalledWith(
      '/api/admin/users/5',
      expect.objectContaining({
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin' }),
      }),
    );
  });

  test('throws ApiRequestError on API error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ error: { code: 'BAD', message: 'oops' } }, { status: 400 }),
    );

    await expect(userManagementClient.listUsers()).rejects.toMatchObject({
      code: 'BAD',
      message: 'oops',
    });
  });
});

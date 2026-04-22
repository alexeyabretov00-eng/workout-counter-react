import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { ApiRequestError } from '@utils';

import { authClient } from '../authClient';

const jsonResponse = (body: unknown, init?: ResponseInit) => {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
};

describe('authClient', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(jsonResponse({ user: { id: 1, login: 'a' } }))),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test('authRegister calls fetch with POST, credentials, JSON body and /api/register', async () => {
    const result = await authClient.register('user', 'secret');
    expect(result.user.login).toBe('a');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      '/api/register',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: 'user', password: 'secret' }),
      }),
    );
  });

  test('authLogin calls fetch with POST, credentials, JSON body and /api/login', async () => {
    await authClient.login('user', 'secret');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      '/api/login',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: 'user', password: 'secret' }),
      }),
    );
  });

  test('authLogout calls fetch with POST, credentials, JSON body {} and /api/logout', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ ok: true }));
    await authClient.logout();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      '/api/logout',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }),
    );
  });

  test('authMe calls fetch with GET, credentials, no body and /api/me', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ user: { id: 2, login: 'b' } }));
    await authClient.me();
    expect(fetch).toHaveBeenCalledTimes(1);
    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(init).toMatchObject({
      method: 'GET',
      credentials: 'include',
    });
    expect(init).not.toHaveProperty('body');
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe('/api/me');
  });

  test('throws ApiRequestError on error body', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ error: { code: 'BAD', message: 'oops' } }, { status: 400 }),
    );
    await expect(authClient.login('u', 'p')).rejects.toMatchObject({
      name: 'ApiRequestError',
      code: 'BAD',
      message: 'oops',
    });
    expect(fetch).toHaveBeenCalledWith(
      '/api/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ login: 'u', password: 'p' }),
      }),
    );
  });

  test('authMe returns null on UNAUTHORIZED', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'no' } }, { status: 401 }),
    );
    await expect(authClient.me()).resolves.toBeNull();
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe('/api/me');
  });

  test('authMe rethrows unknown errors', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ error: { code: 'UNKNOWN', message: 'x' } }, { status: 500 }),
    );
    await expect(authClient.me()).rejects.toBeInstanceOf(ApiRequestError);
  });

  test('authMe returns user on success', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ user: { id: 2, login: 'b' } }));
    await expect(authClient.me()).resolves.toEqual({ user: { id: 2, login: 'b' } });
  });
});

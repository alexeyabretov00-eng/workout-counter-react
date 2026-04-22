import { beforeEach, describe, expect, test, vi } from 'vitest';

import { setupStore } from '../../store';

vi.mock('@api', () => ({
  authClient: {
    me: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

import { authClient } from '@api';
import {
  initializeAuth,
  loginWithPassword,
  logout,
  refreshSession,
  registerWithPassword,
  selectAuthStatus,
  selectAuthUser,
} from '@store';

describe('auth thunks (store + mocked @api)', () => {
  beforeEach(() => {
    vi.mocked(authClient.me).mockReset();
    vi.mocked(authClient.login).mockReset();
    vi.mocked(authClient.register).mockReset();
    vi.mocked(authClient.logout).mockReset();
  });

  test('initializeAuth: /me returns user → ready + user in state', async () => {
    vi.mocked(authClient.me).mockResolvedValue({ user: { id: 10, login: 'remote' } });
    const store = setupStore();

    await store.dispatch(initializeAuth());

    expect(selectAuthStatus(store.getState())).toBe('ready');
    expect(selectAuthUser(store.getState())).toEqual({ id: 10, login: 'remote' });
    expect(authClient.me).toHaveBeenCalledTimes(1);
  });

  test('initializeAuth: /me throws → fulfilled with null user', async () => {
    vi.mocked(authClient.me).mockRejectedValue(new Error('network'));
    const store = setupStore();

    await store.dispatch(initializeAuth());

    expect(selectAuthStatus(store.getState())).toBe('ready');
    expect(selectAuthUser(store.getState())).toBeNull();
  });

  test('loginWithPassword updates user via fulfilled', async () => {
    vi.mocked(authClient.login).mockResolvedValue({ user: { id: 2, login: 'bob' } });
    const store = setupStore({ auth: { user: null, status: 'ready' } });

    await store.dispatch(loginWithPassword({ login: 'bob', password: 'secret' }));

    expect(selectAuthUser(store.getState())).toEqual({ id: 2, login: 'bob' });
  });

  test('registerWithPassword updates user via fulfilled', async () => {
    vi.mocked(authClient.register).mockResolvedValue({ user: { id: 3, login: 'new' } });
    const store = setupStore({ auth: { user: null, status: 'ready' } });

    await store.dispatch(registerWithPassword({ login: 'new', password: 'pw' }));

    expect(selectAuthUser(store.getState())).toEqual({ id: 3, login: 'new' });
  });

  test('logout clears user', async () => {
    vi.mocked(authClient.logout).mockResolvedValue(undefined);
    const store = setupStore({
      auth: { user: { id: 1, login: 'a' }, status: 'ready' },
    });

    await store.dispatch(logout());

    expect(selectAuthUser(store.getState())).toBeNull();
    expect(authClient.logout).toHaveBeenCalledTimes(1);
  });

  test('refreshSession updates user from /me', async () => {
    vi.mocked(authClient.me).mockResolvedValue({ user: { id: 99, login: 'refreshed' } });
    const store = setupStore({
      auth: { user: { id: 1, login: 'old' }, status: 'ready' },
    });

    await store.dispatch(refreshSession());

    expect(selectAuthUser(store.getState())).toEqual({ id: 99, login: 'refreshed' });
  });

  test('refreshSession: /me throws → null user', async () => {
    vi.mocked(authClient.me).mockRejectedValue(new Error('unauthorized'));
    const store = setupStore({
      auth: { user: { id: 1, login: 'a' }, status: 'ready' },
    });

    await store.dispatch(refreshSession());

    expect(selectAuthUser(store.getState())).toBeNull();
  });
});

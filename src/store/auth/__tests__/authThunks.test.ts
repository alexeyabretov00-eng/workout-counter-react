import { beforeEach, describe, expect, test, vi } from 'vitest';

import { setupStore } from '../../store';

vi.mock('@api', () => ({
  authLogin: vi.fn(),
  authLogout: vi.fn(),
  authMe: vi.fn(),
  authRegister: vi.fn(),
}));

import { authLogin, authLogout, authMe, authRegister } from '@api';
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
    vi.mocked(authMe).mockReset();
    vi.mocked(authLogin).mockReset();
    vi.mocked(authRegister).mockReset();
    vi.mocked(authLogout).mockReset();
  });

  test('initializeAuth: /me returns user → ready + user in state', async () => {
    vi.mocked(authMe).mockResolvedValue({ user: { id: 10, login: 'remote' } });
    const store = setupStore();

    await store.dispatch(initializeAuth());

    expect(selectAuthStatus(store.getState())).toBe('ready');
    expect(selectAuthUser(store.getState())).toEqual({ id: 10, login: 'remote' });
    expect(authMe).toHaveBeenCalledTimes(1);
  });

  test('initializeAuth: /me throws → fulfilled with null user', async () => {
    vi.mocked(authMe).mockRejectedValue(new Error('network'));
    const store = setupStore();

    await store.dispatch(initializeAuth());

    expect(selectAuthStatus(store.getState())).toBe('ready');
    expect(selectAuthUser(store.getState())).toBeNull();
  });

  test('loginWithPassword updates user via fulfilled', async () => {
    vi.mocked(authLogin).mockResolvedValue({ user: { id: 2, login: 'bob' } });
    const store = setupStore({ auth: { user: null, status: 'ready' } });

    await store.dispatch(loginWithPassword({ login: 'bob', password: 'secret' }));

    expect(selectAuthUser(store.getState())).toEqual({ id: 2, login: 'bob' });
  });

  test('registerWithPassword updates user via fulfilled', async () => {
    vi.mocked(authRegister).mockResolvedValue({ user: { id: 3, login: 'new' } });
    const store = setupStore({ auth: { user: null, status: 'ready' } });

    await store.dispatch(registerWithPassword({ login: 'new', password: 'pw' }));

    expect(selectAuthUser(store.getState())).toEqual({ id: 3, login: 'new' });
  });

  test('logout clears user', async () => {
    vi.mocked(authLogout).mockResolvedValue(undefined);
    const store = setupStore({
      auth: { user: { id: 1, login: 'a' }, status: 'ready' },
    });

    await store.dispatch(logout());

    expect(selectAuthUser(store.getState())).toBeNull();
    expect(authLogout).toHaveBeenCalledTimes(1);
  });

  test('refreshSession updates user from /me', async () => {
    vi.mocked(authMe).mockResolvedValue({ user: { id: 99, login: 'refreshed' } });
    const store = setupStore({
      auth: { user: { id: 1, login: 'old' }, status: 'ready' },
    });

    await store.dispatch(refreshSession());

    expect(selectAuthUser(store.getState())).toEqual({ id: 99, login: 'refreshed' });
  });

  test('refreshSession: /me throws → null user', async () => {
    vi.mocked(authMe).mockRejectedValue(new Error('unauthorized'));
    const store = setupStore({
      auth: { user: { id: 1, login: 'a' }, status: 'ready' },
    });

    await store.dispatch(refreshSession());

    expect(selectAuthUser(store.getState())).toBeNull();
  });
});

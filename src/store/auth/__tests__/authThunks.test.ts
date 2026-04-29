import { beforeEach, describe, expect, test, vi } from 'vitest';

import { setupStore } from '../../store';

vi.mock('@api', () => ({
  authClient: {
    me: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    changePassword: vi.fn(),
  },
}));

import { authClient } from '@api';
import {
  changePassword,
  initializeAuth,
  loginWithPassword,
  logout,
  registerWithPassword,
  selectAuthStatus,
  selectAuthUser,
} from '@store';

import type { AuthState } from '../types';

const toAuthSliceState = (store: { getState: () => Record<string, unknown> }) => ({
  auth: store.getState().auth as AuthState,
});

describe('auth thunks (store + mocked @api)', () => {
  beforeEach(() => {
    vi.mocked(authClient.me).mockReset();
    vi.mocked(authClient.login).mockReset();
    vi.mocked(authClient.register).mockReset();
    vi.mocked(authClient.logout).mockReset();
    vi.mocked(authClient.changePassword).mockReset();
  });

  test('initializeAuth: /me returns user → ready + user in state', async () => {
    vi.mocked(authClient.me).mockResolvedValue({
      user: {
        id: 10,
        login: 'remote',
        role: 'user',
        mustChangePassword: false,
      },
    });
    const store = setupStore();

    await store.dispatch(initializeAuth());

    expect(selectAuthStatus(toAuthSliceState(store))).toBe('ready');
    expect(selectAuthUser(toAuthSliceState(store))).toEqual({
      id: 10,
      login: 'remote',
      role: 'user',
      mustChangePassword: false,
    });
    expect(authClient.me).toHaveBeenCalledTimes(1);
  });

  test('initializeAuth: /me throws → fulfilled with null user', async () => {
    vi.mocked(authClient.me).mockRejectedValue(new Error('network'));
    const store = setupStore();

    await store.dispatch(initializeAuth());

    expect(selectAuthStatus(toAuthSliceState(store))).toBe('ready');
    expect(selectAuthUser(toAuthSliceState(store))).toBeNull();
  });

  test('loginWithPassword updates user via fulfilled', async () => {
    vi.mocked(authClient.login).mockResolvedValue({
      user: {
        id: 2,
        login: 'bob',
        role: 'user',
        mustChangePassword: false,
      },
    });
    const store = setupStore({ auth: { user: null, status: 'ready' } });

    await store.dispatch(loginWithPassword({ login: 'bob', password: 'secret' }));

    expect(selectAuthUser(toAuthSliceState(store))).toEqual({
      id: 2,
      login: 'bob',
      role: 'user',
      mustChangePassword: false,
    });
  });

  test('registerWithPassword updates user via fulfilled', async () => {
    vi.mocked(authClient.register).mockResolvedValue({
      user: {
        id: 3,
        login: 'new',
        role: 'user',
        mustChangePassword: false,
      },
    });
    const store = setupStore({ auth: { user: null, status: 'ready' } });

    await store.dispatch(registerWithPassword({ login: 'new', password: 'pw' }));

    expect(selectAuthUser(toAuthSliceState(store))).toEqual({
      id: 3,
      login: 'new',
      role: 'user',
      mustChangePassword: false,
    });
  });

  test('logout clears user', async () => {
    vi.mocked(authClient.logout).mockResolvedValue(undefined);
    const store = setupStore({
      auth: {
        user: { id: 1, login: 'a', role: 'user', mustChangePassword: false },
        status: 'ready',
      },
    });

    await store.dispatch(logout());

    expect(selectAuthUser(toAuthSliceState(store))).toBeNull();
    expect(authClient.logout).toHaveBeenCalledTimes(1);
  });

  test('changePassword updates user via fulfilled', async () => {
    vi.mocked(authClient.changePassword).mockResolvedValue({
      user: {
        id: 7,
        login: 'alice',
        role: 'admin',
        mustChangePassword: false,
      },
    });
    const store = setupStore({
      auth: {
        user: { id: 7, login: 'alice', role: 'admin', mustChangePassword: true },
        status: 'ready',
      },
    });

    await store.dispatch(changePassword({ password: 'new-secret' }));

    expect(authClient.changePassword).toHaveBeenCalledWith('new-secret');
    expect(selectAuthUser(toAuthSliceState(store))).toEqual({
      id: 7,
      login: 'alice',
      role: 'admin',
      mustChangePassword: false,
    });
  });

  test('changePassword keeps previous user when request fails', async () => {
    vi.mocked(authClient.changePassword).mockRejectedValue(new Error('network'));
    const store = setupStore({
      auth: {
        user: { id: 9, login: 'owner', role: 'superadmin', mustChangePassword: true },
        status: 'ready',
      },
    });

    await store.dispatch(changePassword({ password: 'bad' }));

    expect(selectAuthUser(toAuthSliceState(store))).toEqual({
      id: 9,
      login: 'owner',
      role: 'superadmin',
      mustChangePassword: true,
    });
  });
});

import { describe, expect, test } from 'vitest';

import { authReducer } from '../authSlice';
import {
  initializeAuth,
  loginWithPassword,
  logout,
  refreshSession,
  registerWithPassword,
} from '../authThunks';
import type { AuthState } from '../types';

const user = { id: 1, login: 'alice' };

const readyWithUser = (): AuthState => ({
  user,
  status: 'ready',
});

describe('authReducer', () => {
  test('initial state: no user, status loading', () => {
    expect(authReducer(undefined, { type: '@@init' })).toEqual({
      user: null,
      status: 'loading',
    });
  });

  test('initializeAuth.fulfilled sets user and status ready', () => {
    const next = authReducer(undefined, initializeAuth.fulfilled({ user }, 'req-1', undefined));
    expect(next).toEqual({ user, status: 'ready' });
  });

  test('initializeAuth.fulfilled with null user leaves ready status', () => {
    const next = authReducer(
      undefined,
      initializeAuth.fulfilled({ user: null }, 'req-2', undefined),
    );
    expect(next).toEqual({ user: null, status: 'ready' });
  });

  test('loginWithPassword.fulfilled updates user', () => {
    const next = authReducer(
      { user: null, status: 'ready' },
      loginWithPassword.fulfilled({ user: { id: 2, login: 'bob' } }, 'req-3', {
        login: 'bob',
        password: 'x',
      }),
    );
    expect(next.user).toEqual({ id: 2, login: 'bob' });
    expect(next.status).toBe('ready');
  });

  test('registerWithPassword.fulfilled updates user', () => {
    const next = authReducer(
      { user: null, status: 'ready' },
      registerWithPassword.fulfilled({ user }, 'req-4', { login: 'alice', password: 'pw' }),
    );
    expect(next.user).toEqual(user);
  });

  test('logout.fulfilled clears user', () => {
    const next = authReducer(readyWithUser(), logout.fulfilled(undefined, 'req-5', undefined));
    expect(next).toEqual({ user: null, status: 'ready' });
  });

  test('refreshSession.fulfilled updates user', () => {
    const next = authReducer(
      readyWithUser(),
      refreshSession.fulfilled({ user: { id: 3, login: 'carol' } }, 'req-6', undefined),
    );
    expect(next.user).toEqual({ id: 3, login: 'carol' });
  });

  test('refreshSession.fulfilled can set user to null', () => {
    const next = authReducer(
      readyWithUser(),
      refreshSession.fulfilled({ user: null }, 'req-7', undefined),
    );
    expect(next.user).toBeNull();
    expect(next.status).toBe('ready');
  });
});

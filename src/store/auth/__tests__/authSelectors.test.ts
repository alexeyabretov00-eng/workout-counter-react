import { describe, expect, test } from 'vitest';

import { selectAuthStatus, selectAuthUser } from '../authSelectors';

describe('selectAuthUser / selectAuthStatus', () => {
  test('read auth slice from root state', () => {
    const state = {
      auth: {
        user: { id: 1, login: 'u', role: 'user' as const, mustChangePassword: false },
        status: 'ready' as const,
      },
    };

    expect(selectAuthUser(state)).toEqual({
      id: 1,
      login: 'u',
      role: 'user',
      mustChangePassword: false,
    });
    expect(selectAuthStatus(state)).toBe('ready');
  });

  test('reflect null user', () => {
    const state = {
      auth: {
        user: null,
        status: 'loading' as const,
      },
    };

    expect(selectAuthUser(state)).toBeNull();
    expect(selectAuthStatus(state)).toBe('loading');
  });
});

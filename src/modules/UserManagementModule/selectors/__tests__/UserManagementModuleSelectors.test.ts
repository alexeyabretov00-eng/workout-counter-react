import { describe, expect, test } from 'vitest';

import { setupStore } from '@store';

import { initialUserManagementModuleState } from '../../store';
import {
  getUserManagementModuleProps,
  getUserManagementModuleState,
  getUserManagementTableContainerProps,
} from '../UserManagementModuleSelectors';

describe('getUserManagementModuleState', () => {
  test('returns userManagement slice state', () => {
    const store = setupStore({
      userManagement: {
        ...initialUserManagementModuleState,
        users: [
          {
            id: 1,
            login: 'alex',
            role: 'admin',
            mustChangePassword: false,
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      },
    });

    expect(getUserManagementModuleState(store.getState())).toEqual(store.getState().userManagement);
  });

  test('returns initial state when userManagement slice is missing', () => {
    expect(getUserManagementModuleState({})).toEqual(initialUserManagementModuleState);
  });
});

describe('getUserManagementModuleProps', () => {
  test('maps users/loading/error/updating from slice', () => {
    const store = setupStore({
      userManagement: {
        users: [
          {
            id: 42,
            login: 'super',
            role: 'superadmin',
            mustChangePassword: true,
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        ],
        isLoading: true,
        error: 'Ошибка загрузки',
        isUpdatingByUserId: { 42: true },
      },
    });

    expect(getUserManagementModuleProps(store.getState())).toEqual({
      users: [
        {
          id: 42,
          login: 'super',
          role: 'superadmin',
          mustChangePassword: true,
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      isLoading: true,
      error: 'Ошибка загрузки',
      isUpdatingByUserId: { 42: true },
    });
  });

  test('returns defaults from initial state', () => {
    const store = setupStore({
      userManagement: initialUserManagementModuleState,
    });

    expect(getUserManagementModuleProps(store.getState())).toEqual({
      users: [],
      isLoading: false,
      error: null,
      isUpdatingByUserId: {},
    });
  });
});

describe('getUserManagementTableContainerProps', () => {
  test('maps currentUserId and table props', () => {
    const store = setupStore({
      auth: {
        user: { id: 7, login: 'root', role: 'superadmin', mustChangePassword: false },
        status: 'ready',
      },
      userManagement: {
        users: [
          {
            id: 42,
            login: 'super',
            role: 'superadmin',
            mustChangePassword: true,
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        ],
        isLoading: true,
        error: 'Ошибка загрузки',
        isUpdatingByUserId: { 42: true },
      },
    });

    expect(getUserManagementTableContainerProps(store.getState())).toEqual({
      currentUserId: 7,
      users: [
        {
          id: 42,
          login: 'super',
          role: 'superadmin',
          mustChangePassword: true,
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      isLoading: true,
      isUpdatingByUserId: { 42: true },
    });
  });

  test('returns null currentUserId for guest', () => {
    const store = setupStore({
      auth: { user: null, status: 'ready' },
      userManagement: initialUserManagementModuleState,
    });

    expect(getUserManagementTableContainerProps(store.getState()).currentUserId).toBeNull();
  });
});

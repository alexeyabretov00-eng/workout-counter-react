import { beforeEach, describe, expect, test, vi } from 'vitest';

import { setupStore } from '@store';

vi.mock('../../api', () => ({
  userManagementClient: {
    listUsers: vi.fn(),
    updateUserRole: vi.fn(),
  },
}));

import { userManagementClient } from '../../api';
import { fetchManagedUsers, updateManagedUserRole } from '../index';
import type { ManagedUser } from '../types';

const USER_FIXTURE: ManagedUser = {
  id: 1,
  login: 'alex',
  role: 'user',
  mustChangePassword: false,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('user management thunks (store + mocked module api)', () => {
  beforeEach(() => {
    vi.mocked(userManagementClient.listUsers).mockReset();
    vi.mocked(userManagementClient.updateUserRole).mockReset();
  });

  test('fetchManagedUsers loads users to userManagement state', async () => {
    vi.mocked(userManagementClient.listUsers).mockResolvedValue({ users: [USER_FIXTURE] });
    const store = setupStore();

    await store.dispatch(fetchManagedUsers());

    expect(store.getState().userManagement.users).toEqual([USER_FIXTURE]);
    expect(store.getState().userManagement.isLoading).toBe(false);
    expect(store.getState().userManagement.error).toBeNull();
  });

  test('updateManagedUserRole updates user and clears updating flag', async () => {
    vi.mocked(userManagementClient.updateUserRole).mockResolvedValue({
      user: { ...USER_FIXTURE, role: 'admin' },
    });
    const store = setupStore({
      userManagement: {
        users: [USER_FIXTURE],
        isLoading: false,
        error: null,
        isUpdatingByUserId: {},
      },
    });

    await store.dispatch(updateManagedUserRole({ id: USER_FIXTURE.id, role: 'admin' }));

    expect(userManagementClient.updateUserRole).toHaveBeenCalledWith(USER_FIXTURE.id, 'admin');
    expect(store.getState().userManagement.users[0]?.role).toBe('admin');
    expect(store.getState().userManagement.isUpdatingByUserId[USER_FIXTURE.id]).toBe(false);
  });

  test('updateManagedUserRole stores error text when request fails', async () => {
    vi.mocked(userManagementClient.updateUserRole).mockRejectedValue(new Error('network'));
    const store = setupStore({
      userManagement: {
        users: [USER_FIXTURE],
        isLoading: false,
        error: null,
        isUpdatingByUserId: {},
      },
    });

    await store.dispatch(updateManagedUserRole({ id: USER_FIXTURE.id, role: 'superadmin' }));

    expect(store.getState().userManagement.error).toBe('Не удалось изменить роль пользователя.');
    expect(store.getState().userManagement.isUpdatingByUserId[USER_FIXTURE.id]).toBe(false);
  });
});

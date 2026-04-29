import { Provider } from 'react-redux';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { setupStore } from '@store';
import { renderWithTheme } from '@test-helpers';

const fetchManagedUsersMock = vi.fn(() => ({ type: 'userManagement/fetchManagedUsers' }));

vi.mock('../store', async importOriginal => {
  const actual = await importOriginal<typeof import('../store')>();
  return {
    ...actual,
    fetchManagedUsers: () => fetchManagedUsersMock(),
  };
});

vi.mock('../containers', () => ({
  UserManagementTableContainer: () => <div data-testid="user-management-table-container" />,
}));

import { UserManagementModule } from '../UserManagementModule';

describe('UserManagementModule', () => {
  beforeEach(() => {
    fetchManagedUsersMock.mockClear();
  });

  test('dispatches fetchManagedUsers on mount and renders layout with table', () => {
    const testStore = setupStore({
      auth: {
        user: { id: 1, login: 'root', role: 'superadmin', mustChangePassword: false },
        status: 'ready',
      },
      userManagement: {
        users: [],
        isLoading: false,
        error: null,
        isUpdatingByUserId: {},
      },
    });

    renderWithTheme(
      <Provider store={testStore}>
        <UserManagementModule />
      </Provider>,
    );

    expect(fetchManagedUsersMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Управление пользователями')).toBeInTheDocument();
    expect(screen.getByTestId('user-management-table-container')).toBeInTheDocument();
  });

  test('shows error alert when selector returns error text', () => {
    const testStore = setupStore({
      auth: {
        user: { id: 1, login: 'root', role: 'superadmin', mustChangePassword: false },
        status: 'ready',
      },
      userManagement: {
        users: [],
        isLoading: false,
        error: 'Ошибка загрузки',
        isUpdatingByUserId: {},
      },
    });

    renderWithTheme(
      <Provider store={testStore}>
        <UserManagementModule />
      </Provider>,
    );

    expect(screen.getByText('Ошибка загрузки')).toBeInTheDocument();
  });
});

import { Provider } from 'react-redux';
import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { AdminModule } from '@modules/AdminModule';
import { exerciseClient } from '@modules/HomeModule/api';
import { setupStore } from '@store';
import { renderWithTheme } from '@test-helpers';

import { adminExerciseClient, adminExerciseSetClient } from '../api';

describe('AdminModule', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(adminExerciseClient, 'list').mockResolvedValue({ exercises: [] });
    vi.spyOn(exerciseClient, 'list').mockResolvedValue({ exercises: [] });
    vi.spyOn(adminExerciseSetClient, 'list').mockResolvedValue({ sets: [] });
    vi.spyOn(adminExerciseSetClient, 'listAssignableUsers').mockResolvedValue({ users: [] });
  });

  test('renders admin title and create form', async () => {
    const store = setupStore({
      auth: {
        status: 'ready',
        user: {
          id: 1,
          login: 'admin1',
          role: 'admin',
          mustChangePassword: false,
        },
      },
    });
    renderWithTheme(
      <Provider store={store}>
        <AdminModule />
      </Provider>,
    );
    expect(await screen.findByRole('heading', { name: 'Админка' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Добавить упражнение' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Сеты упражнений' })).toBeInTheDocument();
  });

  test('loads exercises from public endpoint for user role', async () => {
    const store = setupStore({
      auth: {
        status: 'ready',
        user: {
          id: 101,
          login: 'user1',
          role: 'user',
          mustChangePassword: false,
        },
      },
    });

    renderWithTheme(
      <Provider store={store}>
        <AdminModule />
      </Provider>,
    );

    expect(await screen.findByRole('heading', { name: 'Админка' })).toBeInTheDocument();
    expect(exerciseClient.list).toHaveBeenCalledTimes(1);
    expect(adminExerciseClient.list).not.toHaveBeenCalled();
    expect(screen.queryByRole('tab', { name: 'Каталог упражнений' })).not.toBeInTheDocument();
  });

  test('opens create exercise set drawer by button click', async () => {
    const store = setupStore({
      auth: {
        status: 'ready',
        user: {
          id: 101,
          login: 'user1',
          role: 'user',
          mustChangePassword: false,
        },
      },
    });

    renderWithTheme(
      <Provider store={store}>
        <AdminModule />
      </Provider>,
    );

    expect(await screen.findByRole('button', { name: 'Создать сет' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Создать сет' }));
    expect(await screen.findByText('Создание сета упражнений')).toBeInTheDocument();
  });
});

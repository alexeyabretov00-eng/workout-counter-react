import { Provider } from 'react-redux';
import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { AdminModule } from '@modules/AdminModule';
import { setupStore } from '@store';
import { renderWithTheme } from '@test-helpers';

import { adminExerciseClient } from '../api';

describe('AdminModule', () => {
  beforeEach(() => {
    vi.spyOn(adminExerciseClient, 'list').mockResolvedValue({ exercises: [] });
  });

  test('renders admin title and create form', async () => {
    const store = setupStore();
    renderWithTheme(
      <Provider store={store}>
        <AdminModule />
      </Provider>,
    );
    expect(await screen.findByRole('heading', { name: 'Админка' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Добавить упражнение' })).toBeInTheDocument();
  });
});

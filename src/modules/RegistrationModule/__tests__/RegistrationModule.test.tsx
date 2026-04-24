import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { AppStyleProviders } from '@test-helpers';

vi.mock('@api', async importOriginal => {
  const actual = await importOriginal<typeof import('@api')>();
  return {
    ...actual,
    authClient: Object.assign(
      Object.create(Object.getPrototypeOf(actual.authClient)),
      actual.authClient,
      {
        register: vi.fn(() => Promise.resolve({ user: { id: 2, login: 'newuser' } })),
      },
    ),
  };
});

import { RegistrationModule } from '@modules/RegistrationModule';
import { setupStore } from '@store';
describe('RegistrationModule', () => {
  test('submits credentials and updates auth in store', async () => {
    const user = userEvent.setup();
    const testStore = setupStore({
      auth: { user: null, status: 'ready' },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <AppStyleProviders>
            <RegistrationModule />
          </AppStyleProviders>
        </MemoryRouter>
      </Provider>,
    );
    const loginInput = document.getElementById('register-login-input') as HTMLInputElement;
    const passwordInput = document.getElementById('register-password-input') as HTMLInputElement;
    expect(loginInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    await user.type(loginInput, 'newuser');
    await user.type(passwordInput, 'newpass99');
    await user.click(screen.getByRole('button', { name: 'Создать учётную запись' }));
    await waitFor(() => {
      expect(testStore.getState().auth.user).toEqual({ id: 2, login: 'newuser' });
    });
  });

  test('renders shell and form', () => {
    const testStore = setupStore({
      auth: { user: null, status: 'ready' },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <AppStyleProviders>
            <RegistrationModule />
          </AppStyleProviders>
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Создать учётную запись' })).toBeInTheDocument();
  });
});

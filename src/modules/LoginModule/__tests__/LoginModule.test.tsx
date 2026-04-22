import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { describe, expect, test, vi } from 'vitest';

vi.mock('@api', async importOriginal => {
  const actual = await importOriginal<typeof import('@api')>();
  return {
    ...actual,
    authClient: Object.assign(
      Object.create(Object.getPrototypeOf(actual.authClient)),
      actual.authClient,
      {
        login: vi.fn(() => Promise.resolve({ user: { id: 1, login: 'alice' } })),
      },
    ),
  };
});

import { LoginModule } from '@modules/LoginModule';
import { setupStore } from '@store';
import { theme } from '@theme';

describe('LoginModule', () => {
  test('submits credentials and updates auth in store', async () => {
    const user = userEvent.setup();
    const testStore = setupStore({
      auth: { user: null, status: 'ready' },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <LoginModule />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
    );
    const loginInput = document.querySelector<HTMLInputElement>('input[name="login"]');
    const passwordInput = document.querySelector<HTMLInputElement>('input[name="password"]');
    expect(loginInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    await user.type(loginInput!, 'alice');
    await user.type(passwordInput!, 'secret42');
    await user.click(screen.getByRole('button', { name: 'Войти' }));
    await waitFor(() => {
      expect(testStore.getState().auth.user).toEqual({ id: 1, login: 'alice' });
    });
  });

  test('renders shell and form', () => {
    const testStore = setupStore({
      auth: { user: null, status: 'ready' },
    });

    render(
      <Provider store={testStore}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <LoginModule />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText('Вход')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });
});

import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import * as auth from '@contexts';
import { LoginModule } from '@modules/LoginModule';
import { theme } from '@theme';

vi.mock('@contexts', async importOriginal => {
  const mod = await importOriginal<typeof import('@contexts')>();
  return {
    ...mod,
    useAuthSessionContext: vi.fn(),
  };
});

describe('LoginModule', () => {
  let loginWithPassword: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    loginWithPassword = vi.fn().mockResolvedValue(undefined);
    vi.mocked(auth.useAuthSessionContext).mockReturnValue({
      user: null,
      status: 'ready',
      loginWithPassword,
      registerWithPassword: vi.fn(),
      logout: vi.fn(),
      refresh: vi.fn(),
    });
  });

  test('submits credentials and calls loginWithPassword', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <LoginModule />
        </ThemeProvider>
      </MemoryRouter>,
    );
    const loginInput = document.querySelector<HTMLInputElement>('input[name="login"]');
    const passwordInput = document.querySelector<HTMLInputElement>('input[name="password"]');
    expect(loginInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    await user.type(loginInput!, 'alice');
    await user.type(passwordInput!, 'secret42');
    await user.click(screen.getByRole('button', { name: 'Войти' }));
    await waitFor(() => {
      expect(loginWithPassword).toHaveBeenCalledWith('alice', 'secret42');
    });
  });

  test('renders shell and form', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <LoginModule />
        </ThemeProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('Вход')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
  });
});

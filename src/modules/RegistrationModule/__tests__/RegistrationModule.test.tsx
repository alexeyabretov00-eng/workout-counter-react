import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import * as auth from '@contexts';
import { RegistrationModule } from '@modules/RegistrationModule';
import { theme } from '@theme';

vi.mock('@contexts', async importOriginal => {
  const mod = await importOriginal<typeof import('@contexts')>();
  return {
    ...mod,
    useAuthSessionContext: vi.fn(),
  };
});

describe('RegistrationModule', () => {
  let registerWithPassword: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    registerWithPassword = vi.fn().mockResolvedValue(undefined);
    vi.mocked(auth.useAuthSessionContext).mockReturnValue({
      user: null,
      status: 'ready',
      loginWithPassword: vi.fn(),
      registerWithPassword,
      logout: vi.fn(),
      refresh: vi.fn(),
    });
  });

  test('submits credentials and calls registerWithPassword', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <RegistrationModule />
        </ThemeProvider>
      </MemoryRouter>,
    );
    const loginInput = document.querySelector<HTMLInputElement>('input[name="login"]');
    const passwordInput = document.querySelector<HTMLInputElement>('input[name="password"]');
    expect(loginInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    await user.type(loginInput!, 'newuser');
    await user.type(passwordInput!, 'newpass99');
    await user.click(screen.getByRole('button', { name: 'Создать учётную запись' }));
    await waitFor(() => {
      expect(registerWithPassword).toHaveBeenCalledWith('newuser', 'newpass99');
    });
  });

  test('renders shell and form', () => {
    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <RegistrationModule />
        </ThemeProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Создать учётную запись' })).toBeInTheDocument();
  });
});

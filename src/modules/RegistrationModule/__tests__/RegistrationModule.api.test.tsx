import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { AuthSessionInitializer } from '@app';
import { RegistrationModule } from '@modules/RegistrationModule';
import { setupStore } from '@store';
import { AppStyleProviders } from '@test-helpers';

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

describe('RegistrationModule (fetch через store)', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string, init?: RequestInit) => {
        const method = init?.method ?? 'GET';
        if (url === '/api/me' && method === 'GET') {
          return Promise.resolve(
            jsonResponse({ error: { code: 'UNAUTHORIZED', message: 'no' } }, { status: 401 }),
          );
        }
        if (url === '/api/register' && method === 'POST') {
          return Promise.resolve(jsonResponse({ user: { id: 2, login: 'newuser' } }));
        }
        return Promise.reject(new Error(`unexpected fetch ${String(url)} ${method}`));
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test('после отправки формы вызывается fetch POST /api/register с введёнными данными', async () => {
    const user = userEvent.setup();
    const testStore = setupStore();

    render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={['/register']}>
          <AppStyleProviders>
            <AuthSessionInitializer />
            <RegistrationModule />
          </AppStyleProviders>
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Создать учётную запись' })).toBeInTheDocument();
    });

    const loginInput = document.getElementById('register-login-input') as HTMLInputElement;
    const passwordInput = document.getElementById('register-password-input') as HTMLInputElement;
    expect(loginInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    await user.type(loginInput, 'newuser');
    await user.type(passwordInput, 'newpass99');
    await user.click(screen.getByRole('button', { name: 'Создать учётную запись' }));

    await waitFor(() => {
      expect(vi.mocked(fetch).mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      '/api/me',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      }),
    );
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      '/api/register',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: 'newuser', password: 'newpass99' }),
      }),
    );
  }, 20_000);
});

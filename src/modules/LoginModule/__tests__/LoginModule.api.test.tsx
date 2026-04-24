import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { AuthSessionInitializer } from '@app';
import { LoginModule } from '@modules/LoginModule';
import { setupStore } from '@store';
import { AppStyleProviders } from '@test-helpers';

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

describe('LoginModule (fetch через store)', () => {
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
        if (url === '/api/login' && method === 'POST') {
          return Promise.resolve(jsonResponse({ user: { id: 1, login: 'alice' } }));
        }
        return Promise.reject(new Error(`unexpected fetch ${String(url)} ${method}`));
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test('после отправки формы вызывается fetch POST /api/login с введёнными данными', async () => {
    const user = userEvent.setup();
    const testStore = setupStore();

    render(
      <Provider store={testStore}>
        <MemoryRouter initialEntries={['/login']}>
          <AppStyleProviders>
            <AuthSessionInitializer />
            <LoginModule />
          </AppStyleProviders>
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
    });

    const loginInput = document.getElementById('login-input') as HTMLInputElement;
    const passwordInput = document.getElementById('password-input') as HTMLInputElement;
    expect(loginInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    await user.type(loginInput, 'alice');
    await user.type(passwordInput, 'secret42');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

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
      '/api/login',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: 'alice', password: 'secret42' }),
      }),
    );
  }, 20_000);
});

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { useAuthSessionContext } from '@contexts';

import { AuthSessionProvider } from '../AuthSessionProvider';

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

describe('AuthSessionProvider', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string, init?: RequestInit) => {
        const method = init?.method ?? 'GET';
        if (url === '/api/me' && method === 'GET') {
          return Promise.resolve(jsonResponse({ user: { id: 1, login: 'from-me' } }));
        }
        if (url === '/api/login' && method === 'POST') {
          return Promise.resolve(jsonResponse({ user: { id: 2, login: 'alice' } }));
        }
        if (url === '/api/register' && method === 'POST') {
          return Promise.resolve(jsonResponse({ user: { id: 3, login: 'newuser' } }));
        }
        if (url === '/api/logout' && method === 'POST') {
          return Promise.resolve(jsonResponse({ ok: true }));
        }
        return Promise.reject(new Error(`unexpected fetch ${String(url)} ${method}`));
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test('calls fetch GET /api/me on mount and exposes user', async () => {
    const Consumer = () => {
      const { status, user } = useAuthSessionContext();
      return (
        <div>
          <span data-testid="status">{status}</span>
          <span data-testid="login">{user?.login ?? 'none'}</span>
        </div>
      );
    };

    render(
      <AuthSessionProvider>
        <Consumer />
      </AuthSessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('ready');
    });
    expect(screen.getByTestId('login').textContent).toBe('from-me');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      '/api/me',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include',
      }),
    );
    const [, meInit] = vi.mocked(fetch).mock.calls[0];
    expect(meInit).not.toHaveProperty('body');
  });

  test('loginWithPassword calls fetch POST /api/login with credentials JSON', async () => {
    const user = userEvent.setup();

    const Consumer = () => {
      const { loginWithPassword, status, user: u } = useAuthSessionContext();
      return (
        <div>
          <span data-testid="status">{status}</span>
          <span data-testid="login">{u?.login ?? 'none'}</span>
          <button type="button" onClick={() => void loginWithPassword('alice', 'secret42')}>
            login
          </button>
        </div>
      );
    };

    render(
      <AuthSessionProvider>
        <Consumer />
      </AuthSessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('ready');
    });
    await user.click(screen.getByRole('button', { name: 'login' }));

    await waitFor(() => {
      expect(screen.getByTestId('login').textContent).toBe('alice');
    });

    expect(fetch).toHaveBeenCalledTimes(2);
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
  });

  test('registerWithPassword calls fetch POST /api/register with credentials JSON', async () => {
    const user = userEvent.setup();

    const Consumer = () => {
      const { registerWithPassword, status, user: u } = useAuthSessionContext();
      return (
        <div>
          <span data-testid="status">{status}</span>
          <span data-testid="login">{u?.login ?? 'none'}</span>
          <button type="button" onClick={() => void registerWithPassword('newuser', 'pw99')}>
            register
          </button>
        </div>
      );
    };

    render(
      <AuthSessionProvider>
        <Consumer />
      </AuthSessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('ready');
    });
    await user.click(screen.getByRole('button', { name: 'register' }));

    await waitFor(() => {
      expect(screen.getByTestId('login').textContent).toBe('newuser');
    });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      '/api/register',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: 'newuser', password: 'pw99' }),
      }),
    );
  });

  test('logout calls fetch POST /api/logout with JSON body', async () => {
    const user = userEvent.setup();

    const Consumer = () => {
      const { logout, status, user: u } = useAuthSessionContext();
      return (
        <div>
          <span data-testid="status">{status}</span>
          <span data-testid="login">{u?.login ?? 'none'}</span>
          <button type="button" onClick={() => void logout()}>
            logout
          </button>
        </div>
      );
    };

    render(
      <AuthSessionProvider>
        <Consumer />
      </AuthSessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('status').textContent).toBe('ready');
    });
    expect(screen.getByTestId('login').textContent).toBe('from-me');

    await user.click(screen.getByRole('button', { name: 'logout' }));

    await waitFor(() => {
      expect(screen.getByTestId('login').textContent).toBe('none');
    });

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      '/api/logout',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }),
    );
  });
});

import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { AuthSessionProvider } from '@contexts';
import { theme } from '@theme';

import { AppNavContainer } from '../AppNavContainer';

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

describe('AppNavContainer (fetch через AuthSessionProvider)', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string, init?: RequestInit) => {
        const method = init?.method ?? 'GET';
        if (url === '/api/me' && method === 'GET') {
          return Promise.resolve(jsonResponse({ user: { id: 1, login: 'alex' } }));
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

  test('кнопка «Выйти» вызывает fetch POST /api/logout', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <AuthSessionProvider>
            <AppNavContainer items={[{ path: '/home', label: 'Главная' }]} />
          </AuthSessionProvider>
        </ThemeProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('alex')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Выйти' }));

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

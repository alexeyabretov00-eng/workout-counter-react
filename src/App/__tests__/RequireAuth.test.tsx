import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, test } from 'vitest';

import { AuthSessionContext, type AuthSessionValue } from '@contexts';
import { theme } from '@theme';

import { RequireAuth } from '../RequireAuth';

const baseSession = (overrides: Partial<AuthSessionValue>): AuthSessionValue => ({
  user: null,
  status: 'ready',
  loginWithPassword: async () => undefined,
  registerWithPassword: async () => undefined,
  logout: async () => undefined,
  refresh: async () => undefined,
  ...overrides,
});

describe('RequireAuth', () => {
  test('shows loading while session is loading', () => {
    render(
      <ThemeProvider theme={theme}>
        <AuthSessionContext.Provider value={baseSession({ status: 'loading' })}>
          <MemoryRouter initialEntries={['/app']}>
            <Routes>
              <Route path="/app" element={<RequireAuth />}>
                <Route index element={<div>secret</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </AuthSessionContext.Provider>
      </ThemeProvider>,
    );
    expect(screen.getByText('Загрузка…')).toBeInTheDocument();
  });

  test('renders child route when user is present', () => {
    render(
      <ThemeProvider theme={theme}>
        <AuthSessionContext.Provider
          value={baseSession({ user: { id: 1, login: 'u' }, status: 'ready' })}>
          <MemoryRouter initialEntries={['/app']}>
            <Routes>
              <Route path="/app" element={<RequireAuth />}>
                <Route index element={<div>secret</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </AuthSessionContext.Provider>
      </ThemeProvider>,
    );
    expect(screen.getByText('secret')).toBeInTheDocument();
  });
});

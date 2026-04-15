import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, test, vi } from 'vitest';

import { AuthSessionContext, type AuthSessionValue } from '@contexts';
import { theme } from '@theme';

import { AppNavContainer } from '../AppNavContainer';

const session = (overrides: Partial<AuthSessionValue>): AuthSessionValue => ({
  user: null,
  status: 'ready',
  loginWithPassword: vi.fn(),
  registerWithPassword: vi.fn(),
  logout: vi.fn(),
  refresh: vi.fn(),
  ...overrides,
});

describe('AppNavContainer', () => {
  test('matches snapshot (guest)', () => {
    const { container } = render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <AuthSessionContext.Provider value={session({})}>
            <AppNavContainer items={[{ path: '/home', label: 'Главная' }]} />
          </AuthSessionContext.Provider>
        </ThemeProvider>
      </MemoryRouter>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot (authenticated)', () => {
    const { container } = render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <AuthSessionContext.Provider
            value={session({ user: { id: 1, login: 'alex' }, status: 'ready' })}>
            <AppNavContainer items={[{ path: '/home', label: 'Главная' }]} />
          </AuthSessionContext.Provider>
        </ThemeProvider>
      </MemoryRouter>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot (loading hides auth actions)', () => {
    const { container } = render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <AuthSessionContext.Provider value={session({ status: 'loading' })}>
            <AppNavContainer items={[]} />
          </AuthSessionContext.Provider>
        </ThemeProvider>
      </MemoryRouter>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

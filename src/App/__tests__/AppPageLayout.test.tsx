import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, test, vi } from 'vitest';

import { AuthSessionContext, type AuthSessionValue } from '@contexts';
import { theme } from '@theme';

import { AppPageLayout } from '../AppPageLayout';

const session = (overrides: Partial<AuthSessionValue>): AuthSessionValue => ({
  user: null,
  status: 'ready',
  loginWithPassword: vi.fn(),
  registerWithPassword: vi.fn(),
  logout: vi.fn(),
  refresh: vi.fn(),
  ...overrides,
});

describe('AppPageLayout', () => {
  test('matches snapshot with outlet', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/x']}>
        <ThemeProvider theme={theme}>
          <AuthSessionContext.Provider value={session({ user: { id: 1, login: 'u' } })}>
            <Routes>
              <Route path="/x" element={<AppPageLayout />}>
                <Route index element={<div>page</div>} />
              </Route>
            </Routes>
          </AuthSessionContext.Provider>
        </ThemeProvider>
      </MemoryRouter>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

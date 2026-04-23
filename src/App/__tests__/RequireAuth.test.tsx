import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { setupStore } from '@store';
import { AppStyleProviders } from '@test-helpers';

import { RequireAuth } from '../RequireAuth';

describe('RequireAuth', () => {
  test('shows loading while session is loading', () => {
    const testStore = setupStore({
      auth: { user: null, status: 'loading' },
    });

    render(
      <Provider store={testStore}>
        <AppStyleProviders>
          <MemoryRouter initialEntries={['/app']}>
            <Routes>
              <Route path="/app" element={<RequireAuth />}>
                <Route index element={<div>secret</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </AppStyleProviders>
      </Provider>,
    );
    expect(screen.getByText('Загрузка…')).toBeInTheDocument();
  });

  test('renders child route when user is present', () => {
    const testStore = setupStore({
      auth: { user: { id: 1, login: 'u' }, status: 'ready' },
    });

    render(
      <Provider store={testStore}>
        <AppStyleProviders>
          <MemoryRouter initialEntries={['/app']}>
            <Routes>
              <Route path="/app" element={<RequireAuth />}>
                <Route index element={<div>secret</div>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </AppStyleProviders>
      </Provider>,
    );
    expect(screen.getByText('secret')).toBeInTheDocument();
  });
});

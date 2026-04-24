import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { setupStore } from '@store';
import { AppStyleProviders } from '@test-helpers';

import { AppNavContainer } from '../AppNavContainer';

describe('AppNavContainer', () => {
  test('matches snapshot (guest)', () => {
    const testStore = setupStore({
      auth: { user: null, status: 'ready' },
    });

    const { container } = render(
      <Provider store={testStore}>
        <MemoryRouter>
          <AppStyleProviders>
            <AppNavContainer />
          </AppStyleProviders>
        </MemoryRouter>
      </Provider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot (authenticated)', () => {
    const testStore = setupStore({
      auth: { user: { id: 1, login: 'alex' }, status: 'ready' },
    });

    const { container } = render(
      <Provider store={testStore}>
        <MemoryRouter>
          <AppStyleProviders>
            <AppNavContainer />
          </AppStyleProviders>
        </MemoryRouter>
      </Provider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot (loading hides auth actions)', () => {
    const testStore = setupStore({
      auth: { user: null, status: 'loading' },
    });

    const { container } = render(
      <Provider store={testStore}>
        <MemoryRouter>
          <AppStyleProviders>
            <AppNavContainer />
          </AppStyleProviders>
        </MemoryRouter>
      </Provider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

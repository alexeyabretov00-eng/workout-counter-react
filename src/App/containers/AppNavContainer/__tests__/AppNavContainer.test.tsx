import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, test } from 'vitest';

import { setupStore } from '@store';
import { theme } from '@theme';

import { AppNavContainer } from '../AppNavContainer';

describe('AppNavContainer', () => {
  test('matches snapshot (guest)', () => {
    const testStore = setupStore({
      auth: { user: null, status: 'ready' },
    });

    const { container } = render(
      <Provider store={testStore}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <AppNavContainer />
          </ThemeProvider>
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
          <ThemeProvider theme={theme}>
            <AppNavContainer />
          </ThemeProvider>
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
          <ThemeProvider theme={theme}>
            <AppNavContainer />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, test } from 'vitest';

import { theme } from '@theme';

import { AppPageLayout } from '..';

describe('AppPageLayout', () => {
  test('matches snapshot with outlet', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/x']}>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/x" element={<AppPageLayout header={<div>header</div>} />}>
              <Route index element={<div>page</div>} />
            </Route>
          </Routes>
        </ThemeProvider>
      </MemoryRouter>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

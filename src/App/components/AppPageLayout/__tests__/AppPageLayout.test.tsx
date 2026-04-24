import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { AppStyleProviders } from '@test-helpers';

import { AppPageLayout } from '..';

describe('AppPageLayout', () => {
  test('matches snapshot with outlet', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/x']}>
        <AppStyleProviders>
          <Routes>
            <Route path="/x" element={<AppPageLayout header={<div>header</div>} />}>
              <Route index element={<div>page</div>} />
            </Route>
          </Routes>
        </AppStyleProviders>
      </MemoryRouter>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

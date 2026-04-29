import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { AppStyleProviders } from '@test-helpers';

import { AppPageLayout } from '..';

describe('AppPageLayout', () => {
  test('matches snapshot with children', () => {
    const { container } = render(
      <AppStyleProviders>
        <AppPageLayout header={<div>header</div>}>
          <div>page</div>
        </AppPageLayout>
      </AppStyleProviders>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

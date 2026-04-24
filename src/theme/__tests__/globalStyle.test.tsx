import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { AppStyleProviders } from '@test-helpers';
import { GlobalStyle } from '@theme';

describe('GlobalStyle', () => {
  test('injects global rules with theme', () => {
    const { container } = render(
      <AppStyleProviders>
        <GlobalStyle />
      </AppStyleProviders>,
    );
    expect(container).toMatchSnapshot();
  });
});

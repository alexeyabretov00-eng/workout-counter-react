import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, expect, test } from 'vitest';

import { GlobalStyle, theme } from '@theme';

describe('GlobalStyle', () => {
  test('injects global rules with theme', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <GlobalStyle />
      </ThemeProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});

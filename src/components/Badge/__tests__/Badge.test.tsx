import { describe, expect, test } from 'vitest';

import { Badge } from '@components';
import { renderWithTheme } from '@test-helpers';

describe('Badge', () => {
  test.each([
    ['neutral'],
    ['success'],
    ['info'],
    ['error'],
    ['warning'],
    ['muted'],
    ['note'],
  ] as const)('matches snapshot (%s)', variant => {
    const { container } = renderWithTheme(<Badge variant={variant}>label</Badge>);
    expect(container.firstChild).toMatchSnapshot();
  });
});

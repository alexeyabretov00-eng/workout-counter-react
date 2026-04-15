import { describe, expect, test } from 'vitest';

import { theme } from '../theme';

describe('theme', () => {
  test('exposes palette and layout tokens', () => {
    expect(theme.palette.text.primary).toMatch(/^#/);
    expect(theme.layout.maxWidth).toBeTruthy();
    expect(theme.spacing.md).toBeTruthy();
  });
});

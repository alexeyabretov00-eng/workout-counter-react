import { describe, expect, test } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { AdminPage } from '../AdminPage';

describe('AdminPage', () => {
  test('matches snapshot', () => {
    const { container } = renderWithTheme(<AdminPage />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

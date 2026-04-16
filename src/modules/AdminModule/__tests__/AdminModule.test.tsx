import { describe, expect, test } from 'vitest';

import { AdminModule } from '@modules/AdminModule';
import { renderWithTheme } from '@test-helpers';

describe('AdminModule', () => {
  test('matches snapshot', () => {
    const { container } = renderWithTheme(<AdminModule />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

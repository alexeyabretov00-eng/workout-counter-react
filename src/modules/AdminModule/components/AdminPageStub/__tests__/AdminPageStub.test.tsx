import { describe, expect, test } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { AdminPageStub } from '../AdminPageStub';

describe('AdminPageStub', () => {
  test('matches snapshot', () => {
    const { container } = renderWithTheme(<AdminPageStub lead="Заглушка: раздел в разработке." />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

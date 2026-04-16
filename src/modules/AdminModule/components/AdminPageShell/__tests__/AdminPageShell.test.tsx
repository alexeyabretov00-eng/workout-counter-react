import { describe, expect, test } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { AdminPageShell } from '../AdminPageShell';

describe('AdminPageShell', () => {
  test('matches snapshot', () => {
    const { container } = renderWithTheme(
      <AdminPageShell title="Админка">
        <div>child</div>
      </AdminPageShell>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

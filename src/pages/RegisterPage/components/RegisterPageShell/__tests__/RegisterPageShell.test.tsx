import { describe, expect, test } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { RegisterPageShell } from '../RegisterPageShell';

describe('RegisterPageShell', () => {
  test('matches snapshot', () => {
    const { container } = renderWithTheme(
      <RegisterPageShell title="Регистрация">
        <div>child</div>
      </RegisterPageShell>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

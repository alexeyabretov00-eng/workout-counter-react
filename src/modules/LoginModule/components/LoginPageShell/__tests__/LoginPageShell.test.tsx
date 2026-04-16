import { describe, expect, test } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { LoginPageShell } from '../LoginPageShell';

describe('LoginPageShell', () => {
  test('matches snapshot', () => {
    const { container } = renderWithTheme(
      <LoginPageShell title="Вход">
        <div>child</div>
      </LoginPageShell>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

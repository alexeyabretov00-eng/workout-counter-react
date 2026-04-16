import { useState } from 'react';
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { renderWithRouterTheme } from '@test-helpers';

import { RegisterForm } from '../RegisterForm';

describe('RegisterForm', () => {
  test('calls change handlers when user types in fields', async () => {
    const user = userEvent.setup();
    const onLoginChange = vi.fn();
    const onPasswordChange = vi.fn();

    const RegisterFormTypingHarness = () => {
      const [login, setLogin] = useState('');
      const [password, setPassword] = useState('');
      return (
        <RegisterForm
          login={login}
          password={password}
          error={null}
          pending={false}
          onLoginChange={value => {
            setLogin(value);
            onLoginChange(value);
          }}
          onPasswordChange={value => {
            setPassword(value);
            onPasswordChange(value);
          }}
          onSubmit={vi.fn(async () => undefined)}
        />
      );
    };

    const { container } = renderWithRouterTheme(<RegisterFormTypingHarness />);
    const loginInput = container.querySelector<HTMLInputElement>('input[name="login"]');
    const passwordInput = container.querySelector<HTMLInputElement>('input[name="password"]');
    expect(loginInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    await user.type(loginInput!, 'ab');
    await user.type(passwordInput!, 'cd');
    expect(onLoginChange).toHaveBeenLastCalledWith('ab');
    expect(onPasswordChange).toHaveBeenLastCalledWith('cd');
  });

  test('calls onSubmit when submit button is clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => undefined);
    const { container } = renderWithRouterTheme(
      <RegisterForm
        login="x"
        password="y"
        error={null}
        pending={false}
        onLoginChange={vi.fn()}
        onPasswordChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );
    const region = within(container);
    await user.click(region.getByRole('button', { name: 'Создать учётную запись' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test('footer link navigates to login route', () => {
    const { container } = renderWithRouterTheme(
      <RegisterForm
        login=""
        password=""
        error={null}
        pending={false}
        onLoginChange={vi.fn()}
        onPasswordChange={vi.fn()}
        onSubmit={vi.fn(async () => undefined)}
      />,
    );
    const region = within(container);
    expect(region.getByRole('link', { name: 'Войти' })).toHaveAttribute('href', '/login');
  });

  test('matches snapshot without error', () => {
    const { container } = renderWithRouterTheme(
      <RegisterForm
        login="a"
        password="b"
        error={null}
        pending={false}
        onLoginChange={vi.fn()}
        onPasswordChange={vi.fn()}
        onSubmit={vi.fn(async () => undefined)}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  test('matches snapshot with error', () => {
    const { container } = renderWithRouterTheme(
      <RegisterForm
        login=""
        password=""
        error="fail"
        pending={false}
        onLoginChange={vi.fn()}
        onPasswordChange={vi.fn()}
        onSubmit={vi.fn(async () => undefined)}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});

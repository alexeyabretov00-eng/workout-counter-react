import { useState } from 'react';
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { renderWithRouterTheme } from '@test-helpers';

import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  test('calls change handlers when user types in fields', async () => {
    const user = userEvent.setup();
    const onLoginChange = vi.fn();
    const onPasswordChange = vi.fn();

    const LoginFormTypingHarness = () => {
      const [login, setLogin] = useState('');
      const [password, setPassword] = useState('');
      return (
        <LoginForm
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
          onGoToRegister={vi.fn()}
        />
      );
    };

    const { container } = renderWithRouterTheme(<LoginFormTypingHarness />);
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
      <LoginForm
        login="x"
        password="y"
        error={null}
        pending={false}
        onLoginChange={vi.fn()}
        onPasswordChange={vi.fn()}
        onSubmit={onSubmit}
        onGoToRegister={vi.fn()}
      />,
    );
    const region = within(container);
    await user.click(region.getByRole('button', { name: 'Войти' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test('footer button calls onGoToRegister', async () => {
    const user = userEvent.setup();
    const onGoToRegister = vi.fn();
    const { container } = renderWithRouterTheme(
      <LoginForm
        login=""
        password=""
        error={null}
        pending={false}
        onLoginChange={vi.fn()}
        onPasswordChange={vi.fn()}
        onSubmit={vi.fn(async () => undefined)}
        onGoToRegister={onGoToRegister}
      />,
    );
    const region = within(container);
    await user.click(region.getByRole('button', { name: 'Регистрация' }));
    expect(onGoToRegister).toHaveBeenCalledTimes(1);
  });

  test('matches snapshot without error', () => {
    const { container } = renderWithRouterTheme(
      <LoginForm
        login="a"
        password="b"
        error={null}
        pending={false}
        onLoginChange={vi.fn()}
        onPasswordChange={vi.fn()}
        onSubmit={vi.fn(async () => undefined)}
        onGoToRegister={vi.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  test('matches snapshot with error and pending', () => {
    const { container } = renderWithRouterTheme(
      <LoginForm
        login=""
        password=""
        error="fail"
        pending
        onLoginChange={vi.fn()}
        onPasswordChange={vi.fn()}
        onSubmit={vi.fn(async () => undefined)}
        onGoToRegister={vi.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});

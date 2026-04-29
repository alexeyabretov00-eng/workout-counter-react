import { useState } from 'react';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { renderWithRouterTheme } from '@test-helpers';

import { ChangePasswordForm } from '../ChangePasswordForm';

describe('ChangePasswordForm', () => {
  test('calls onPasswordChange when user types', async () => {
    const user = userEvent.setup();
    const onPasswordChange = vi.fn();

    const ChangePasswordFormTypingHarness = () => {
      const [password, setPassword] = useState('');
      return (
        <ChangePasswordForm
          password={password}
          pending={false}
          isSubmitDisabled={false}
          error={null}
          onPasswordChange={value => {
            setPassword(value);
            onPasswordChange(value);
          }}
          onSubmit={vi.fn(async () => undefined)}
        />
      );
    };

    renderWithRouterTheme(<ChangePasswordFormTypingHarness />);
    const passwordInput = screen.getByLabelText('Новый пароль');
    await user.type(passwordInput, 'secret42');

    expect(onPasswordChange).toHaveBeenLastCalledWith('secret42');
  });

  test('calls onSubmit when submit button is clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => undefined);
    const { container } = renderWithRouterTheme(
      <ChangePasswordForm
        password="secret42"
        pending={false}
        isSubmitDisabled={false}
        error={null}
        onPasswordChange={vi.fn()}
        onSubmit={onSubmit}
      />,
    );
    const region = within(container);

    await user.click(region.getByRole('button', { name: 'Сменить пароль' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test('shows pending state and disables controls', () => {
    renderWithRouterTheme(
      <ChangePasswordForm
        password="secret42"
        pending
        isSubmitDisabled
        error={null}
        onPasswordChange={vi.fn()}
        onSubmit={vi.fn(async () => undefined)}
      />,
    );

    expect(screen.getByLabelText('Новый пароль')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Сохраняем…' })).toBeDisabled();
  });

  test('shows error message', () => {
    renderWithRouterTheme(
      <ChangePasswordForm
        password="secret42"
        pending={false}
        isSubmitDisabled={false}
        error="Не удалось сменить пароль."
        onPasswordChange={vi.fn()}
        onSubmit={vi.fn(async () => undefined)}
      />,
    );

    expect(screen.getByText('Не удалось сменить пароль.')).toBeInTheDocument();
  });
});

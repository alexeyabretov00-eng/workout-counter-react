import { Provider } from 'react-redux';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { setupStore } from '@store';
import { renderWithTheme } from '@test-helpers';
import { eventBus } from '@utils';

import { EVENT_AUTH_NAVIGATE_AFTER_PASSWORD_CHANGE } from '../../../constants';
import { ChangePasswordFormContainer } from '../ChangePasswordFormContainer';

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

describe('ChangePasswordFormContainer', () => {
  beforeEach(() => {
    vi.spyOn(eventBus, 'emit').mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  const renderContainer = () => {
    const testStore = setupStore({
      auth: {
        user: { id: 1, login: 'alex', role: 'admin', mustChangePassword: true },
        status: 'ready',
      },
    });

    return renderWithTheme(
      <Provider store={testStore}>
        <ChangePasswordFormContainer />
      </Provider>,
    );
  };

  test('submits new password and emits navigation event on success', async () => {
    const user = userEvent.setup();
    const emitSpy = vi.spyOn(eventBus, 'emit');

    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          jsonResponse({
            user: { id: 1, login: 'alex', role: 'admin', mustChangePassword: false },
          }),
        ),
      ),
    );

    renderContainer();

    await user.type(screen.getByLabelText('Новый пароль'), 'secret42');
    await user.click(screen.getByRole('button', { name: 'Сменить пароль' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/change-password',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: 'secret42' }),
        }),
      );
      expect(emitSpy).toHaveBeenCalledWith(EVENT_AUTH_NAVIGATE_AFTER_PASSWORD_CHANGE);
    });
  });

  test('shows fallback error and does not emit event on failure', async () => {
    const user = userEvent.setup();
    const emitSpy = vi.spyOn(eventBus, 'emit');

    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          jsonResponse(
            { error: { code: 'VALIDATION', message: 'Пароль слишком короткий.' } },
            { status: 400 },
          ),
        ),
      ),
    );

    renderContainer();

    await user.type(screen.getByLabelText('Новый пароль'), 'secret42');
    await user.click(screen.getByRole('button', { name: 'Сменить пароль' }));

    expect(await screen.findByText('Не удалось сменить пароль.')).toBeInTheDocument();
    expect(emitSpy).not.toHaveBeenCalledWith(EVENT_AUTH_NAVIGATE_AFTER_PASSWORD_CHANGE);
  });
});

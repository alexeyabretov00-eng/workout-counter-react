import { useState } from 'react';

import { ApiRequestError } from '@api';
import { changePassword, useAppDispatch } from '@store';
import { eventBus } from '@utils';

import { ChangePasswordForm } from '../../components';
import { EVENT_AUTH_NAVIGATE_AFTER_PASSWORD_CHANGE } from '../../constants';

export const ChangePasswordFormContainer = () => {
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSubmitDisabled = pending || password.length < 8;

  const handleSubmit = async () => {
    setPending(true);
    setError(null);
    try {
      await dispatch(changePassword({ password })).unwrap();
      eventBus.emit(EVENT_AUTH_NAVIGATE_AFTER_PASSWORD_CHANGE);
    } catch (err: unknown) {
      const text =
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Не удалось сменить пароль.';
      setError(text);
    } finally {
      setPending(false);
    }
  };

  return (
    <ChangePasswordForm
      password={password}
      pending={pending}
      isSubmitDisabled={isSubmitDisabled}
      error={error}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
};

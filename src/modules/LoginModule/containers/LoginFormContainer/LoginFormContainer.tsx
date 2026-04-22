import { useState } from 'react';

import { loginWithPassword, useAppDispatch, useAppSelector } from '@store';
import {
  ApiRequestError,
  EVENT_AUTH_NAVIGATE_AFTER_LOGIN,
  EVENT_NAV_GO_TO_REGISTER,
  eventBus,
} from '@utils';

import { LoginForm } from '../../components';
import { getLoginFormContainerProps } from '../../selectors';

export const LoginFormContainer = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector(getLoginFormContainerProps);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!isLoading && user) {
    eventBus.emit(EVENT_AUTH_NAVIGATE_AFTER_LOGIN);
    return null;
  }

  const handleSubmit = async () => {
    setError(null);
    setPending(true);
    try {
      await dispatch(loginWithPassword({ login, password })).unwrap();
    } catch (err: unknown) {
      const message =
        err instanceof ApiRequestError ? err.message : 'Не удалось войти. Попробуйте ещё раз.';
      setError(message);
    } finally {
      setPending(false);
    }
  };

  const handleGoToRegister = () => {
    eventBus.emit(EVENT_NAV_GO_TO_REGISTER);
  };

  return (
    <LoginForm
      login={login}
      password={password}
      error={error}
      pending={pending}
      onLoginChange={setLogin}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onGoToRegister={handleGoToRegister}
    />
  );
};

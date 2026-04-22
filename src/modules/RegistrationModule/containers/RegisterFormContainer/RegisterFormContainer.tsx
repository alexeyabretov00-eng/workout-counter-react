import { useState } from 'react';

import { registerWithPassword, useAppDispatch, useAppSelector } from '@store';
import {
  ApiRequestError,
  EVENT_AUTH_NAVIGATE_AFTER_REGISTRATION,
  EVENT_NAV_GO_TO_LOGIN,
  eventBus,
} from '@utils';

import { RegisterForm } from '../../components';
import { selectRegistrationModuleAuth } from '../../selectors';

export const RegisterFormContainer = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector(selectRegistrationModuleAuth);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!isLoading && user) {
    eventBus.emit(EVENT_AUTH_NAVIGATE_AFTER_REGISTRATION);
    return null;
  }

  const handleSubmit = async () => {
    setError(null);
    setPending(true);
    try {
      await dispatch(registerWithPassword({ login, password })).unwrap();
    } catch (err: unknown) {
      const message =
        err instanceof ApiRequestError
          ? err.message
          : 'Не удалось зарегистрироваться. Попробуйте ещё раз.';
      setError(message);
    } finally {
      setPending(false);
    }
  };

  const handleGoToLogin = () => {
    eventBus.emit(EVENT_NAV_GO_TO_LOGIN);
  };

  return (
    <RegisterForm
      login={login}
      password={password}
      error={error}
      pending={pending}
      onLoginChange={setLogin}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onGoToLogin={handleGoToLogin}
    />
  );
};

import { useState } from 'react';

import { AuthApiError } from '@api';
import { registerWithPassword, useAppDispatch, useAppSelector } from '@store';
import { EVENT_AUTH_NAVIGATE_AFTER_REGISTRATION, eventBus } from '@utils';

import { RegisterPageShell } from './components';
import { RegisterFormContainer } from './containers';
import { selectRegistrationModuleAuth } from './selectors';

export const RegistrationModule = () => {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector(selectRegistrationModuleAuth);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (status === 'ready' && user) {
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
        err instanceof AuthApiError
          ? err.message
          : 'Не удалось зарегистрироваться. Попробуйте ещё раз.';
      setError(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <RegisterPageShell title="Регистрация">
      <RegisterFormContainer
        login={login}
        password={password}
        error={error}
        pending={pending}
        onLoginChange={setLogin}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
      />
    </RegisterPageShell>
  );
};

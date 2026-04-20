import { useState } from 'react';

import { AuthApiError } from '@api';
import { useAuthSessionContext } from '@contexts';
import { EVENT_AUTH_NAVIGATE_AFTER_REGISTRATION, eventBus } from '@utils';

import { RegisterFormContainer } from './containers/RegisterFormContainer';
import { RegisterPageShell } from './components';

export const RegistrationModule = () => {
  const { registerWithPassword, user, status } = useAuthSessionContext();
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
      await registerWithPassword(login, password);
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

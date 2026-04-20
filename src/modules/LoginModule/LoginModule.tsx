import { useState } from 'react';

import { AuthApiError } from '@api';
import { useAuthSessionContext } from '@contexts';
import { EVENT_AUTH_NAVIGATE_AFTER_LOGIN, eventBus } from '@utils';

import { LoginForm, LoginPageShell } from './components';

export const LoginModule = () => {
  const { loginWithPassword, user, status } = useAuthSessionContext();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (status === 'ready' && user) {
    eventBus.emit(EVENT_AUTH_NAVIGATE_AFTER_LOGIN);
    return null;
  }

  const handleSubmit = async () => {
    setError(null);
    setPending(true);
    try {
      await loginWithPassword(login, password);
    } catch (err: unknown) {
      const message =
        err instanceof AuthApiError ? err.message : 'Не удалось войти. Попробуйте ещё раз.';
      setError(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <LoginPageShell title="Вход">
      <LoginForm
        login={login}
        password={password}
        error={error}
        pending={pending}
        onLoginChange={setLogin}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
      />
    </LoginPageShell>
  );
};

import { useState } from 'react';

import { AuthApiError } from '@api';
import { loginWithPassword, useAppDispatch, useAppSelector } from '@store';
import { EVENT_AUTH_NAVIGATE_AFTER_LOGIN, eventBus } from '@utils';

import { LoginPageShell } from './components';
import { LoginFormContainer } from './containers';
import { selectLoginModuleAuth } from './selectors';

export const LoginModule = () => {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector(selectLoginModuleAuth);
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
      await dispatch(loginWithPassword({ login, password })).unwrap();
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
      <LoginFormContainer
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

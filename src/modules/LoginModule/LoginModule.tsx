import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AuthApiError } from '@api';
import { useAuthSessionContext } from '@contexts';
import { resolveAfterAuthPath } from '@utils';

import { LoginForm, LoginPageShell } from './components';

export const LoginModule = () => {
  const { loginWithPassword, user, status } = useAuthSessionContext();
  const location = useLocation();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const state = location.state as { from?: { pathname?: string } } | undefined;
  const afterAuthPath = resolveAfterAuthPath(state?.from);

  if (status === 'ready' && user) {
    return <Navigate to={afterAuthPath} replace />;
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

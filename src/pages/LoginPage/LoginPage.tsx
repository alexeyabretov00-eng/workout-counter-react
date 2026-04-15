import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { AuthApiError } from '@api';
import { useAuthSessionContext } from '@contexts';
import { resolveAfterAuthPath } from '@utils';

import { LoginForm, LoginPageShell } from './components';

export const LoginPage = () => {
  const { loginWithPassword, user, status } = useAuthSessionContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (status === 'ready' && user) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async () => {
    setError(null);
    setPending(true);
    try {
      await loginWithPassword(login, password);
      const state = location.state as { from?: { pathname?: string } } | undefined;
      const target = resolveAfterAuthPath(state?.from);
      navigate(target, { replace: true });
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

import { LoginPageShell } from './components';
import { LoginFormContainer } from './containers';

export const LoginModule = () => {
  return (
    <LoginPageShell title="Вход">
      <LoginFormContainer />
    </LoginPageShell>
  );
};

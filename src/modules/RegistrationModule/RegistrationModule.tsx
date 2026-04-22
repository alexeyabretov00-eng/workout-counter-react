import { RegisterPageShell } from './components';
import { RegisterFormContainer } from './containers';

export const RegistrationModule = () => {
  return (
    <RegisterPageShell title="Регистрация">
      <RegisterFormContainer />
    </RegisterPageShell>
  );
};

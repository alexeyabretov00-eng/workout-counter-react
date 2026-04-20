import { EVENT_NAV_GO_TO_REGISTER, eventBus } from '@utils';

import { LoginForm, type LoginFormProps } from '../../components/LoginForm';

export type LoginFormContainerProps = Omit<LoginFormProps, 'onGoToRegister'>;

export const LoginFormContainer = (props: LoginFormContainerProps) => {
  const handleGoToRegister = () => {
    eventBus.emit(EVENT_NAV_GO_TO_REGISTER);
  };

  return <LoginForm {...props} onGoToRegister={handleGoToRegister} />;
};

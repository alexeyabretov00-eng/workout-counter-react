import { EVENT_NAV_GO_TO_LOGIN, eventBus } from '@utils';

import { RegisterForm, type RegisterFormProps } from '../../components/RegisterForm';

export type RegisterFormContainerProps = Omit<RegisterFormProps, 'onGoToLogin'>;

export const RegisterFormContainer = (props: RegisterFormContainerProps) => {
  const handleGoToLogin = () => {
    eventBus.emit(EVENT_NAV_GO_TO_LOGIN);
  };

  return <RegisterForm {...props} onGoToLogin={handleGoToLogin} />;
};

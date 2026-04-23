import { Alert, Form, Input } from 'antd';

import { Button } from '@components';

import {
  RegisterFormFooter,
  RegisterFormFooterLink,
  RegisterFormRoot,
} from './RegisterForm.styled';

export type RegisterFormProps = {
  login: string;
  password: string;
  error: string | null;
  pending: boolean;
  onLoginChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  onGoToLogin: () => void;
};

export const RegisterForm: React.FC<RegisterFormProps> = ({
  login,
  password,
  error,
  pending,
  onLoginChange,
  onPasswordChange,
  onSubmit,
  onGoToLogin,
}) => {
  return (
    <>
      <RegisterFormRoot
        layout="vertical"
        requiredMark={false}
        onFinish={() => {
          void onSubmit();
        }}
        noValidate>
        {error ? <Alert type="error" showIcon title={error} role="alert" /> : null}
        <Form.Item label="Логин" htmlFor="register-login-input">
          <Input
            id="register-login-input"
            name="login"
            autoComplete="username"
            value={login}
            onChange={e => {
              onLoginChange(e.target.value);
            }}
            disabled={pending}
          />
        </Form.Item>
        <Form.Item label="Пароль" htmlFor="register-password-input">
          <Input.Password
            id="register-password-input"
            name="password"
            autoComplete="new-password"
            value={password}
            onChange={e => {
              onPasswordChange(e.target.value);
            }}
            disabled={pending}
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" disabled={pending} block>
            {pending ? 'Регистрация…' : 'Создать учётную запись'}
          </Button>
        </Form.Item>
      </RegisterFormRoot>
      <RegisterFormFooter>
        Уже есть аккаунт?{' '}
        <RegisterFormFooterLink onClick={onGoToLogin}>Войти</RegisterFormFooterLink>
      </RegisterFormFooter>
    </>
  );
};

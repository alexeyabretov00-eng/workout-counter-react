import { Alert, Form, Input } from 'antd';

import { Button } from '@components';

import { LoginFormFooter, LoginFormFooterLink, LoginFormRoot } from './LoginForm.styled';

export type LoginFormProps = {
  login: string;
  password: string;
  error: string | null;
  pending: boolean;
  onLoginChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  onGoToRegister: () => void;
};

export const LoginForm: React.FC<LoginFormProps> = ({
  login,
  password,
  error,
  pending,
  onLoginChange,
  onPasswordChange,
  onSubmit,
  onGoToRegister,
}) => {
  return (
    <>
      <LoginFormRoot
        layout="vertical"
        requiredMark={false}
        onFinish={() => {
          void onSubmit();
        }}
        noValidate>
        {error ? <Alert type="error" showIcon title={error} role="alert" /> : null}
        <Form.Item label="Логин" htmlFor="login-input">
          <Input
            id="login-input"
            name="login"
            autoComplete="username"
            value={login}
            onChange={e => {
              onLoginChange(e.target.value);
            }}
            disabled={pending}
          />
        </Form.Item>
        <Form.Item label="Пароль" htmlFor="password-input">
          <Input.Password
            id="password-input"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={e => {
              onPasswordChange(e.target.value);
            }}
            disabled={pending}
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" disabled={pending} block>
            {pending ? 'Вход…' : 'Войти'}
          </Button>
        </Form.Item>
      </LoginFormRoot>
      <LoginFormFooter>
        Нет учётной записи?{' '}
        <LoginFormFooterLink onClick={onGoToRegister}>Регистрация</LoginFormFooterLink>
      </LoginFormFooter>
    </>
  );
};

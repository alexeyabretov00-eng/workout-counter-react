import { type FormEvent } from 'react';

import {
  LoginFormError,
  LoginFormFooter,
  LoginFormFooterLinkButton,
  LoginFormInput,
  LoginFormLabel,
  LoginFormRoot,
  LoginFormSubmit,
} from './LoginForm.styled';

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

export const LoginForm = ({
  login,
  password,
  error,
  pending,
  onLoginChange,
  onPasswordChange,
  onSubmit,
  onGoToRegister,
}: LoginFormProps) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void onSubmit();
  };

  return (
    <>
      <LoginFormRoot onSubmit={handleSubmit}>
        {error ? <LoginFormError role="alert">{error}</LoginFormError> : null}
        <LoginFormLabel>
          Логин
          <LoginFormInput
            name="login"
            autoComplete="username"
            value={login}
            onChange={e => {
              onLoginChange(e.target.value);
            }}
            disabled={pending}
          />
        </LoginFormLabel>
        <LoginFormLabel>
          Пароль
          <LoginFormInput
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => {
              onPasswordChange(e.target.value);
            }}
            disabled={pending}
          />
        </LoginFormLabel>
        <LoginFormSubmit type="submit" disabled={pending}>
          {pending ? 'Вход…' : 'Войти'}
        </LoginFormSubmit>
      </LoginFormRoot>
      <LoginFormFooter>
        Нет учётной записи?{' '}
        <LoginFormFooterLinkButton onClick={onGoToRegister}>Регистрация</LoginFormFooterLinkButton>
      </LoginFormFooter>
    </>
  );
};

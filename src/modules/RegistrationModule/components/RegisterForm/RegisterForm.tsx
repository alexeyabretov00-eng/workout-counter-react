import {
  RegisterFormError,
  RegisterFormFooter,
  RegisterFormFooterLinkButton,
  RegisterFormInput,
  RegisterFormLabel,
  RegisterFormRoot,
  RegisterFormSubmit,
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

export const RegisterForm = ({
  login,
  password,
  error,
  pending,
  onLoginChange,
  onPasswordChange,
  onSubmit,
  onGoToLogin,
}: RegisterFormProps) => {
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit();
  };

  return (
    <>
      <RegisterFormRoot onSubmit={handleSubmit}>
        {error ? <RegisterFormError role="alert">{error}</RegisterFormError> : null}
        <RegisterFormLabel>
          Логин
          <RegisterFormInput
            name="login"
            autoComplete="username"
            value={login}
            onChange={e => {
              onLoginChange(e.target.value);
            }}
            disabled={pending}
          />
        </RegisterFormLabel>
        <RegisterFormLabel>
          Пароль
          <RegisterFormInput
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={e => {
              onPasswordChange(e.target.value);
            }}
            disabled={pending}
          />
        </RegisterFormLabel>
        <RegisterFormSubmit type="submit" disabled={pending}>
          {pending ? 'Регистрация…' : 'Создать учётную запись'}
        </RegisterFormSubmit>
      </RegisterFormRoot>
      <RegisterFormFooter>
        Уже есть аккаунт?{' '}
        <RegisterFormFooterLinkButton onClick={onGoToLogin}>Войти</RegisterFormFooterLinkButton>
      </RegisterFormFooter>
    </>
  );
};

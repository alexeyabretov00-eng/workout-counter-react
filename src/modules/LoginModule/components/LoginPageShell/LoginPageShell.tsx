import { LoginPageRoot, LoginPageTitle } from './LoginPageShell.styled';

export type LoginPageShellProps = {
  title: string;
};

export const LoginPageShell: React.FC<React.PropsWithChildren<LoginPageShellProps>> = ({
  title,
  children,
}) => {
  return (
    <LoginPageRoot>
      <LoginPageTitle>{title}</LoginPageTitle>
      {children}
    </LoginPageRoot>
  );
};

import { ModuleScaffold } from '@components';

export type LoginPageShellProps = {
  title: string;
};

export const LoginPageShell: React.FC<React.PropsWithChildren<LoginPageShellProps>> = ({
  title,
  children,
}) => {
  return <ModuleScaffold title={title}>{children}</ModuleScaffold>;
};

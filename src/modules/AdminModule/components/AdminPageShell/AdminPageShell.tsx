import { ModuleScaffold } from '@components';

export type AdminPageShellProps = {
  title: string;
};

export const AdminPageShell: React.FC<React.PropsWithChildren<AdminPageShellProps>> = ({
  title,
  children,
}) => {
  return <ModuleScaffold title={title}>{children}</ModuleScaffold>;
};

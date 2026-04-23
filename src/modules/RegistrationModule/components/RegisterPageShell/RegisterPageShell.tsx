import type { ReactNode } from 'react';

import { ModuleScaffold } from '@components';

export type RegisterPageShellProps = {
  title: string;
  children: ReactNode;
};

export const RegisterPageShell = ({ title, children }: RegisterPageShellProps) => {
  return <ModuleScaffold title={title}>{children}</ModuleScaffold>;
};

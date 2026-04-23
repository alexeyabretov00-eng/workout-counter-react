import type { ReactNode } from 'react';

import { ModuleScaffold } from '@components';

export type AdminPageShellProps = {
  title: string;
  children: ReactNode;
};

export const AdminPageShell = ({ title, children }: AdminPageShellProps) => {
  return <ModuleScaffold title={title}>{children}</ModuleScaffold>;
};

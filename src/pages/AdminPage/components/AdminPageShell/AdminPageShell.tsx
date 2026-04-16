import type { ReactNode } from 'react';

import { AdminPageRoot, AdminPageTitle } from './AdminPageShell.styled';

export type AdminPageShellProps = {
  title: string;
  children: ReactNode;
};

export const AdminPageShell = ({ title, children }: AdminPageShellProps) => {
  return (
    <AdminPageRoot>
      <AdminPageTitle>{title}</AdminPageTitle>
      {children}
    </AdminPageRoot>
  );
};

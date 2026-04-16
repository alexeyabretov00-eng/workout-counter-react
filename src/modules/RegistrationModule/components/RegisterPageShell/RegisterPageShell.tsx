import type { ReactNode } from 'react';

import { RegisterPageRoot, RegisterPageTitle } from './RegisterPageShell.styled';

export type RegisterPageShellProps = {
  title: string;
  children: ReactNode;
};

export const RegisterPageShell = ({ title, children }: RegisterPageShellProps) => {
  return (
    <RegisterPageRoot>
      <RegisterPageTitle>{title}</RegisterPageTitle>
      {children}
    </RegisterPageRoot>
  );
};

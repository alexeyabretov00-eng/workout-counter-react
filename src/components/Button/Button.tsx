import type { ReactNode } from 'react';

import { ButtonRoot } from './Button.styled';

export type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
};

export const Button = ({ children, onClick, disabled, ariaLabel }: ButtonProps) => {
  return (
    <ButtonRoot type="button" onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </ButtonRoot>
  );
};

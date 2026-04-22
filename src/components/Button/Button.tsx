import { ButtonRoot } from './Button.styled';

export type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel?: string;
};

export const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  disabled,
  ariaLabel,
}) => {
  return (
    <ButtonRoot type="button" onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </ButtonRoot>
  );
};

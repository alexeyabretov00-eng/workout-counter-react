import { BadgeRoot, type BadgeVariant } from './Badge.styled';

export type { BadgeVariant };

export type BadgeProps = {
  variant: BadgeVariant;
};

export const Badge: React.FC<React.PropsWithChildren<BadgeProps>> = ({ children, variant }) => {
  return <BadgeRoot $variant={variant}>{children}</BadgeRoot>;
};

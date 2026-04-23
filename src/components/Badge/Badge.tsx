import { BadgeTag } from './Badge.styled';

export type BadgeVariant = 'neutral' | 'success' | 'info' | 'error' | 'warning' | 'muted' | 'note';

export type BadgeProps = {
  variant: BadgeVariant;
};

const variantToTag: Record<BadgeVariant, { color?: string; $textTone?: 'muted' | 'note' }> = {
  neutral: { color: 'default' },
  success: { color: 'success' },
  info: { color: 'blue' },
  error: { color: 'error' },
  warning: { color: 'warning' },
  muted: { $textTone: 'muted' },
  note: { $textTone: 'note' },
};

export const Badge: React.FC<React.PropsWithChildren<BadgeProps>> = ({ children, variant }) => {
  const { color, $textTone } = variantToTag[variant];
  return (
    <BadgeTag color={color} $textTone={$textTone}>
      {children}
    </BadgeTag>
  );
};

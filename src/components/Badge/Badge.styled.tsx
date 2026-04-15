import styled, { css } from 'styled-components';

export type BadgeVariant = 'neutral' | 'success' | 'info' | 'error' | 'warning' | 'muted' | 'note';

export const BadgeRoot = styled.span<{ $variant: BadgeVariant }>`
  padding: ${({ theme }) => theme.spacing.xs} 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ theme }) => theme.palette.surface.neutralBadgeBorder};
  background: ${({ theme }) => theme.palette.surface.neutralBadge};
  ${({ theme, $variant }) => {
    switch ($variant) {
      case 'success':
        return css`
          color: ${theme.palette.status.success.fg};
          border-color: ${theme.palette.status.success.border};
          background: ${theme.palette.status.success.bg};
        `;
      case 'info':
        return css`
          color: ${theme.palette.status.info.fg};
          border-color: ${theme.palette.status.info.border};
          background: ${theme.palette.status.info.bg};
        `;
      case 'error':
        return css`
          color: ${theme.palette.status.error.fg};
          border-color: ${theme.palette.status.error.border};
          background: ${theme.palette.status.error.bg};
        `;
      case 'warning':
        return css`
          color: ${theme.palette.status.warning.fg};
          border-color: ${theme.palette.status.warning.border};
          background: ${theme.palette.status.warning.bg};
        `;
      case 'muted':
        return css`
          color: ${theme.palette.text.gray600};
        `;
      case 'note':
        return css`
          color: ${theme.palette.text.gray700};
        `;
      case 'neutral':
      default:
        return '';
    }
  }}
`;

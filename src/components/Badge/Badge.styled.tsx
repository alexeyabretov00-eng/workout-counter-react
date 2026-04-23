import { Tag } from 'antd';
import styled, { css } from 'styled-components';

export const BadgeTag = styled(Tag).attrs({ variant: 'filled' as const })<{
  $textTone?: 'muted' | 'note';
}>`
  ${({ $textTone, theme }) =>
    $textTone === 'muted' &&
    css`
      && {
        color: ${theme.palette.text.gray600};
      }
    `}
  ${({ $textTone, theme }) =>
    $textTone === 'note' &&
    css`
      && {
        color: ${theme.palette.text.gray700};
      }
    `}
`;

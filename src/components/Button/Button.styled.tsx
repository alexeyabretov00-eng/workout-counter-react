import styled from 'styled-components';

export const ButtonRoot = styled.button`
  height: ${({ theme }) => theme.controlHeight};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.palette.border.default};
  padding: 0 ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.palette.button.bg};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.palette.button.bgHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

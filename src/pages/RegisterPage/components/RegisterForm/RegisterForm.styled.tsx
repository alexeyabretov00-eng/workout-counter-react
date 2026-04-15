import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const RegisterFormRoot = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 360px;
`;

export const RegisterFormLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.statusBar};
  color: ${({ theme }) => theme.palette.text.gray700};
`;

export const RegisterFormInput = styled.input`
  height: ${({ theme }) => theme.controlHeight};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.palette.border.default};
  padding: 0 ${({ theme }) => theme.spacing.md};
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.statusBar};
`;

export const RegisterFormSubmit = styled.button`
  height: ${({ theme }) => theme.controlHeight};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.palette.border.default};
  padding: 0 ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.palette.button.bg};
  cursor: pointer;
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.statusBar};

  &:hover {
    background: ${({ theme }) => theme.palette.button.bgHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const RegisterFormError = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.palette.status.error.border};
  background: ${({ theme }) => theme.palette.status.error.bg};
  color: ${({ theme }) => theme.palette.status.error.fg};
  font-size: ${({ theme }) => theme.typography.statusBar};
`;

export const RegisterFormFooter = styled.p`
  margin: ${({ theme }) => theme.spacing.lg} 0 0;
  font-size: ${({ theme }) => theme.typography.statusBar};
  color: ${({ theme }) => theme.palette.text.muted};
`;

export const RegisterFormFooterLink = styled(Link)`
  color: ${({ theme }) => theme.palette.status.info.fg};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

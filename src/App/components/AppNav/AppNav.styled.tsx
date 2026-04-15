import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const AppNavRoot = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.palette.surface.card};
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.default};
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  box-sizing: border-box;
`;

export const AppNavMain = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1 1 auto;
`;

export const AppNavAuth = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-left: auto;
`;

export const AppNavUserLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.statusBar};
  color: ${({ theme }) => theme.palette.text.muted};
`;

export const AppNavTextButton = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: ${({ theme }) => theme.typography.statusBar};
  font-family: ${({ theme }) => theme.typography.family};
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.palette.text.gray700};
  }
`;

export const AppNavLink = styled(NavLink)`
  color: ${({ theme }) => theme.palette.text.primary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.statusBar};
  font-family: ${({ theme }) => theme.typography.family};

  &[aria-current='page'] {
    font-weight: ${({ theme }) => theme.typography.labelWeight};
  }
`;

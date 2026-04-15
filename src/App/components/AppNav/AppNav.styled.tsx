import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

export const AppNavRoot = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.palette.surface.card};
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.default};
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  box-sizing: border-box;
`

export const AppNavLink = styled(NavLink)`
  color: ${({ theme }) => theme.palette.text.primary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.statusBar};
  font-family: ${({ theme }) => theme.typography.family};

  &[aria-current='page'] {
    font-weight: ${({ theme }) => theme.typography.labelWeight};
  }
`

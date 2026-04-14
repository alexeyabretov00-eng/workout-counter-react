import styled from 'styled-components'

export const AppRootLayoutRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

export const RouteOutletFallbackRoot = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.palette.text.muted};
`

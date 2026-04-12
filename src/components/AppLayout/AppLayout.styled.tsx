import styled from 'styled-components'

export const AppLayoutRoot = styled.main`
  margin: 0 auto;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  padding: ${({ theme }) => theme.spacing.xl};
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const AppLayoutSection = styled.section``

export const AppLayoutHeaderSection = styled(AppLayoutSection)`
  & h1 {
    margin: 0;
  }

  & p {
    margin: ${({ theme }) => theme.spacing.sm} 0 0;
    color: ${({ theme }) => theme.palette.text.muted};
  }
`

export const AppLayoutStageSection = styled(AppLayoutSection)`
  min-width: 0;
`

import styled from 'styled-components'

export const HomeLayoutRoot = styled.main`
  margin: 0 auto;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  padding: ${({ theme }) => theme.spacing.xl};
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const HomeLayoutSection = styled.section``

export const HomeLayoutHeaderSection = styled(HomeLayoutSection)`
  & h1 {
    margin: 0;
  }

  & p {
    margin: ${({ theme }) => theme.spacing.sm} 0 0;
    color: ${({ theme }) => theme.palette.text.muted};
  }
`

export const HomeLayoutStageSection = styled(HomeLayoutSection)`
  min-width: 0;
`

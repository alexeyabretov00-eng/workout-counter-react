import styled from 'styled-components'

export const WorkoutStatusBarRoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  font-size: ${({ theme }) => theme.typography.statusBar};
`

export const WorkoutStatusBarCameraError = styled.span`
  color: ${({ theme }) => theme.palette.status.error.fg};
`

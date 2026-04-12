import styled, { css } from 'styled-components'

export const WorkoutStatusBarRoot = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  font-size: ${({ theme }) => theme.typography.statusBar};
`

const pillBase = css`
  padding: ${({ theme }) => theme.spacing.xs} 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ theme }) => theme.palette.surface.neutralBadgeBorder};
  background: ${({ theme }) => theme.palette.surface.neutralBadge};
`

export const WorkoutStatusBarModelBadge = styled.span<{ $status: string }>`
  ${pillBase}
  ${({ theme, $status }) => {
    switch ($status) {
      case 'ready':
        return css`
          color: ${theme.palette.status.success.fg};
          border-color: ${theme.palette.status.success.border};
          background: ${theme.palette.status.success.bg};
        `
      case 'loading':
        return css`
          color: ${theme.palette.status.info.fg};
          border-color: ${theme.palette.status.info.border};
          background: ${theme.palette.status.info.bg};
        `
      case 'error':
        return css`
          color: ${theme.palette.status.error.fg};
          border-color: ${theme.palette.status.error.border};
          background: ${theme.palette.status.error.bg};
        `
      default:
        return ''
    }
  }}
`

export const WorkoutStatusBarCameraBadge = styled.span<{ $ready: boolean }>`
  ${pillBase}
  ${({ theme, $ready }) =>
    $ready
      ? css`
          color: ${theme.palette.status.success.fg};
          border-color: ${theme.palette.status.success.border};
          background: ${theme.palette.status.success.bg};
        `
      : css`
          color: ${theme.palette.text.gray600};
        `}
`

export const WorkoutStatusBarVoiceBadge = styled.span<{ $status: string }>`
  ${pillBase}
  ${({ theme, $status }) => {
    switch ($status) {
      case 'listening':
        return css`
          color: ${theme.palette.status.info.fg};
          border-color: ${theme.palette.status.info.border};
          background: ${theme.palette.status.info.bg};
        `
      case 'inactive-tab':
        return css`
          color: ${theme.palette.status.warning.fg};
          border-color: ${theme.palette.status.warning.border};
          background: ${theme.palette.status.warning.bg};
        `
      case 'blocked':
      case 'error':
        return css`
          color: ${theme.palette.status.error.fg};
          border-color: ${theme.palette.status.error.border};
          background: ${theme.palette.status.error.bg};
        `
      case 'unsupported':
        return css`
          color: ${theme.palette.text.gray600};
        `
      default:
        return ''
    }
  }}
`

export const WorkoutStatusBarSessionNote = styled.span`
  ${pillBase}
  color: ${({ theme }) => theme.palette.text.gray700};
`

export const WorkoutStatusBarCameraError = styled.span`
  color: ${({ theme }) => theme.palette.status.error.fg};
`

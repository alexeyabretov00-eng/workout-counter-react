import { memo, type ReactNode } from 'react'
import {
  AppLayoutHeaderSection,
  AppLayoutRoot,
  AppLayoutSection,
  AppLayoutStageSection,
} from './AppLayout.styled'

export type AppLayoutProps = {
  header: ReactNode
  controls: ReactNode
  statusBar: ReactNode
  stage: ReactNode
}

const AppLayoutComponent = ({ header, controls, statusBar, stage }: AppLayoutProps) => {
  return (
    <AppLayoutRoot>
      <AppLayoutHeaderSection>{header}</AppLayoutHeaderSection>
      <AppLayoutSection>{controls}</AppLayoutSection>
      <AppLayoutSection>{statusBar}</AppLayoutSection>
      <AppLayoutStageSection>{stage}</AppLayoutStageSection>
    </AppLayoutRoot>
  )
}

export const AppLayout = memo(AppLayoutComponent)
AppLayout.displayName = 'AppLayout'

import { memo, type ReactNode } from 'react'
import {
  HomeLayoutHeaderSection,
  HomeLayoutRoot,
  HomeLayoutSection,
  HomeLayoutStageSection,
} from './HomeLayout.styled'

export type HomeLayoutProps = {
  header: ReactNode
  controls: ReactNode
  statusBar: ReactNode
  stage: ReactNode
}

const HomeLayoutComponent = ({ header, controls, statusBar, stage }: HomeLayoutProps) => {
  return (
    <HomeLayoutRoot>
      <HomeLayoutHeaderSection>{header}</HomeLayoutHeaderSection>
      <HomeLayoutSection>{controls}</HomeLayoutSection>
      <HomeLayoutSection>{statusBar}</HomeLayoutSection>
      <HomeLayoutStageSection>{stage}</HomeLayoutStageSection>
    </HomeLayoutRoot>
  )
}

export const HomeLayout = memo(HomeLayoutComponent)
HomeLayout.displayName = 'HomeLayout'

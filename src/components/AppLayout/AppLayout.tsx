import { memo, type ReactNode } from 'react'
import './AppLayout.css'

export type AppLayoutProps = {
  header: ReactNode
  controls: ReactNode
  statusBar: ReactNode
  stage: ReactNode
}

function AppLayoutComponent({ header, controls, statusBar, stage }: AppLayoutProps) {
  return (
    <main className="app-layout">
      <section className="app-layout__section header">{header}</section>
      <section className="app-layout__section controls">{controls}</section>
      <section className="app-layout__section status-bar">{statusBar}</section>
      <section className="app-layout__section stage">{stage}</section>
    </main>
  )
}

export const AppLayout = memo(AppLayoutComponent)
AppLayout.displayName = 'AppLayout'

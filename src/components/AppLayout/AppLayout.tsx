import type { ReactNode } from 'react'
import './AppLayout.css'

export type AppLayoutProps = {
  header: ReactNode
  controls: ReactNode
  statusBar: ReactNode
  stage: ReactNode
  stageAriaBusy?: boolean
}

export function AppLayout({ header, controls, statusBar, stage, stageAriaBusy }: AppLayoutProps) {
  return (
    <main className="app-layout">
      <section className="app-layout__section header">{header}</section>
      <section className="app-layout__section controls">{controls}</section>
      <section className="app-layout__section status-bar">{statusBar}</section>
      <section className="app-layout__section stage" aria-busy={stageAriaBusy}>
        {stage}
      </section>
    </main>
  )
}

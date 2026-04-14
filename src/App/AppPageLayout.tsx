import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { AppNav } from '../components/AppNav'
import { AppRootLayoutRoot, RouteOutletFallbackRoot } from './AppPageLayout.styled'
import { navItems } from '../routes'

export const AppPageLayout = () => {
  return (
    <AppRootLayoutRoot>
      <AppNav items={navItems} />
      <Suspense
        fallback={
          <RouteOutletFallbackRoot role="status" aria-live="polite">
            Загрузка…
          </RouteOutletFallbackRoot>
        }
      >
        <Outlet />
      </Suspense>
    </AppRootLayoutRoot>
  )
}

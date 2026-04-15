import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthSessionContext } from '../contexts'
import { RouteOutletFallbackRoot } from './AppPageLayout.styled'

export const RequireAuth = () => {
  const { user, status } = useAuthSessionContext()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <RouteOutletFallbackRoot role="status" aria-live="polite">
        Загрузка…
      </RouteOutletFallbackRoot>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

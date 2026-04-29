import { matchRoutes, Navigate, Outlet, useLocation } from 'react-router-dom';

import { canAccessRouteForRole, protectedAppRoutes } from '@routes';
import { useAppSelector } from '@store';

import { CHANGE_PASSWORD_PAGE_PATH, LOGIN_PAGE_PATH } from '../pages/authPaths';

import { RouteOutletFallbackRoot } from './components';
import { getRequireAuthProps } from './selectors';

export const RequireAuth = () => {
  const { user, role, mustChangePassword, isLoading } = useAppSelector(getRequireAuthProps);
  const location = useLocation();

  if (isLoading) {
    return (
      <RouteOutletFallbackRoot role="status" aria-live="polite">
        Загрузка…
      </RouteOutletFallbackRoot>
    );
  }

  if (!user) {
    return <Navigate to={LOGIN_PAGE_PATH} replace state={{ from: location }} />;
  }

  if (mustChangePassword && location.pathname !== CHANGE_PASSWORD_PAGE_PATH) {
    return <Navigate to={CHANGE_PASSWORD_PAGE_PATH} replace state={{ from: location }} />;
  }

  const matchedRoutes = matchRoutes(protectedAppRoutes, location);
  const currentRoute = matchedRoutes?.[matchedRoutes.length - 1]?.route;
  if (currentRoute && !canAccessRouteForRole(currentRoute, role)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

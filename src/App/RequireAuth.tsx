import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '@store';

import { RouteOutletFallbackRoot } from './components';
import { getRequireAuthProps } from './selectors';

export const RequireAuth = () => {
  const { user, isLoading } = useAppSelector(getRequireAuthProps);
  const location = useLocation();

  if (isLoading) {
    return (
      <RouteOutletFallbackRoot role="status" aria-live="polite">
        Загрузка…
      </RouteOutletFallbackRoot>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

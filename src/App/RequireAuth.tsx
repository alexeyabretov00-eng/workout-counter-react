import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '@store';

import { RouteOutletFallbackRoot } from './components';
import { selectRequireAuthGate } from './selectors';

export const RequireAuth = () => {
  const { user, status } = useAppSelector(selectRequireAuthGate);
  const location = useLocation();

  if (status === 'loading') {
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

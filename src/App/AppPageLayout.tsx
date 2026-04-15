import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { useAuthSessionContext } from '@contexts';
import { navItems } from '@routes';

import { AppRootLayoutRoot, RouteOutletFallbackRoot } from './AppPageLayout.styled';
import { AppNav } from './components';
export const AppPageLayout = () => {
  const { user } = useAuthSessionContext();
  const mainNavItems = user ? navItems : [];

  return (
    <AppRootLayoutRoot>
      <AppNav items={mainNavItems} />
      <Suspense
        fallback={
          <RouteOutletFallbackRoot role="status" aria-live="polite">
            Загрузка…
          </RouteOutletFallbackRoot>
        }>
        <Outlet />
      </Suspense>
    </AppRootLayoutRoot>
  );
};

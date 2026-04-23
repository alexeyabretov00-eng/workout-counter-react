import { type ReactNode, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AppPageContent, AppPageLayoutRoot, RouteOutletFallbackRoot } from './AppPageLayout.styled';

export type AppPageLayoutProps = {
  /** Верхняя область оболочки (например контейнер навигации), без привязки к store внутри layout. */
  header: ReactNode;
};

export const AppPageLayout = ({ header }: AppPageLayoutProps) => {
  return (
    <AppPageLayoutRoot>
      {header}
      <AppPageContent>
        <Suspense
          fallback={
            <RouteOutletFallbackRoot role="status" aria-live="polite">
              Загрузка…
            </RouteOutletFallbackRoot>
          }>
          <Outlet />
        </Suspense>
      </AppPageContent>
    </AppPageLayoutRoot>
  );
};

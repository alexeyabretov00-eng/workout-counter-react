import { type ReactNode, Suspense } from 'react';

import { AppPageContent, AppPageLayoutRoot, RouteOutletFallbackRoot } from './AppPageLayout.styled';

export type AppPageLayoutProps = {
  /** Верхняя область оболочки (например контейнер навигации), без привязки к store внутри layout. */
  header: ReactNode;
};

export const AppPageLayout: React.FC<React.PropsWithChildren<AppPageLayoutProps>> = ({
  header,
  children,
}) => {
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
          {children}
        </Suspense>
      </AppPageContent>
    </AppPageLayoutRoot>
  );
};

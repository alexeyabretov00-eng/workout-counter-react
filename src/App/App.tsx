import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { protectedAppRoutes, publicAuthRoutes } from '@routes';
import { initializeAuth, store, useAppDispatch } from '@store';
import { GlobalStyle, theme } from '@theme';

import { AppPageLayout } from './components';
import { AppNavContainer } from './containers';
import { RequireAuth } from './RequireAuth';

/** Должен рендериться внутри `Provider`; для интеграционных тестов экспортируется из `@app`. */
export const AuthSessionInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(initializeAuth());
  }, [dispatch]);

  return null;
};

export const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AuthSessionInitializer />
        <RouterProvider
          router={createBrowserRouter([
            {
              element: <AppPageLayout header={<AppNavContainer />} />,
              children: [
                ...publicAuthRoutes,
                {
                  element: <RequireAuth />,
                  children: [...protectedAppRoutes],
                },
              ],
            },
          ])}
        />
      </ThemeProvider>
    </Provider>
  );
};

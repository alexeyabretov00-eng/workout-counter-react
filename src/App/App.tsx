import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';

import { protectedAppRoutes, publicAuthRoutes } from '@routes';
import { store } from '@store';
import { getAntdThemeConfig, GlobalStyle, theme } from '@theme';

import { AuthSessionInitializer } from './AuthSessionInitializer';
import { AppPageLayout } from './components';
import { AppNavContainer } from './containers';
import { RequireAuth } from './RequireAuth';

export const App = () => {
  return (
    <Provider store={store}>
      <ConfigProvider theme={getAntdThemeConfig(theme)}>
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
      </ConfigProvider>
    </Provider>
  );
};

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { AuthSessionProvider } from '@contexts'
import { protectedAppRoutes, publicAuthRoutes } from '@routes'
import { GlobalStyle, theme } from '@theme'
import { AppPageLayout } from './AppPageLayout'
import { RequireAuth } from './RequireAuth'

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthSessionProvider>
        <RouterProvider
          router={createBrowserRouter([
            {
              element: <AppPageLayout />,
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
      </AuthSessionProvider>
    </ThemeProvider>
  )
}
import type { RouteObject } from 'react-router'
import { AdminPage } from './AdminPage'

export const routes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminPage />,
    handle: {
      nav: { label: 'Админка', sort: 1 },
    }
  },
]

export { AdminPage }

import type { RouteObject } from 'react-router'
import { RegisterPageLazy } from './RegisterPageLazy'

export const routes: RouteObject[] = [
  {
    path: '/register',
    element: <RegisterPageLazy />,
    handle: {
      auth: 'public',
    },
  },
]

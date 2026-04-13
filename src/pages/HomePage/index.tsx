import { Navigate, type RouteObject } from 'react-router'
import { HomePage } from './HomePage'

export const routes: RouteObject[] = [
  {
    index: true,
    path: '/home',
    element: <HomePage />,
    handle: {
      nav: { label: 'Главная', end: true, sort: 0 },
    }
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]

export { HomePage }

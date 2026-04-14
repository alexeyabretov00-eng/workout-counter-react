import { Navigate, type RouteObject } from 'react-router'
import { HomePageLazy } from './HomePageLazy'

export const routes: RouteObject[] = [
  {
    index: true,
    path: '/home',
    element: <HomePageLazy />,
    handle: {
      nav: { label: 'Главная', end: true, sort: 0 },
    },
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]

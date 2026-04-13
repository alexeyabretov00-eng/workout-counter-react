import type { RouteObject } from 'react-router'
import { ExerciseHistoryPage } from './ExerciseHistoryPage'

export const routes: RouteObject[] = [
  {
    path: '/history',
    element: <ExerciseHistoryPage />,
    handle: {
      nav: { label: 'История', sort: 2 },
    }
  },
]

export { ExerciseHistoryPage }

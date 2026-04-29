import type { RouteObject } from 'react-router';

import { ExerciseHistoryPageLazy } from './ExerciseHistoryPageLazy';

export const routes: RouteObject[] = [
  {
    path: '/history',
    element: <ExerciseHistoryPageLazy />,
    handle: {
      roles: ['user', 'admin', 'superadmin'],
      nav: { label: 'История', sort: 2 },
    },
  },
];

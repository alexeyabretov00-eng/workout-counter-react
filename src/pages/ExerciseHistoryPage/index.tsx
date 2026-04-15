import type { RouteObject } from 'react-router';

import { ExerciseHistoryPageLazy } from './ExerciseHistoryPageLazy';

export const routes: RouteObject[] = [
  {
    path: '/history',
    element: <ExerciseHistoryPageLazy />,
    handle: {
      nav: { label: 'История', sort: 2 },
    },
  },
];

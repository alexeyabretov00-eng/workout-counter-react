import type { RouteObject } from 'react-router';

import { REGISTER_PAGE_PATH } from '../authPaths';

import { RegisterPageLazy } from './RegisterPageLazy';

export const routes: RouteObject[] = [
  {
    path: REGISTER_PAGE_PATH,
    element: <RegisterPageLazy />,
    handle: {
      auth: 'public',
    },
  },
];

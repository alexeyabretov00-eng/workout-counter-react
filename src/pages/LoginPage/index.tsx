import type { RouteObject } from 'react-router';

import { LoginPageLazy } from './LoginPageLazy';

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPageLazy />,
    handle: {
      auth: 'public',
    },
  },
];

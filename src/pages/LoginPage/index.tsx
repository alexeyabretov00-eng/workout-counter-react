import type { RouteObject } from 'react-router';

import { LOGIN_PAGE_PATH } from '../authPaths';

import { LoginPageLazy } from './LoginPageLazy';

export const routes: RouteObject[] = [
  {
    path: LOGIN_PAGE_PATH,
    element: <LoginPageLazy />,
    handle: {
      auth: 'public',
    },
  },
];

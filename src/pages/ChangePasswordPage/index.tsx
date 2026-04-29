import type { RouteObject } from 'react-router';

import { CHANGE_PASSWORD_PAGE_PATH } from '../authPaths';

import { ChangePasswordPageLazy } from './ChangePasswordPageLazy';

export const routes: RouteObject[] = [
  {
    path: CHANGE_PASSWORD_PAGE_PATH,
    element: <ChangePasswordPageLazy />,
    handle: {
      roles: ['user', 'admin', 'superadmin'],
    },
  },
];

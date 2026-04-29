import type { RouteObject } from 'react-router';

import { UserManagementPageLazy } from './UserManagementPageLazy';

export const routes: RouteObject[] = [
  {
    path: '/admin/users',
    element: <UserManagementPageLazy />,
    handle: {
      roles: ['superadmin'],
      nav: { label: 'Пользователи', sort: 3 },
    },
  },
];

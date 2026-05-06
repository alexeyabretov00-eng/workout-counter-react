import type { RouteObject } from 'react-router';

import { AdminPageLazy } from './AdminPageLazy';

export const routes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminPageLazy />,
    handle: {
      roles: ['user', 'admin', 'superadmin'],
      nav: { label: 'Админка', sort: 1 },
    },
  },
];

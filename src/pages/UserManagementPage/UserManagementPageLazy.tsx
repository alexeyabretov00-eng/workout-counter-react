import { lazy } from 'react';

export const UserManagementPageLazy = lazy(async () => {
  const { UserManagementPage } = await import('./UserManagementPage');
  return { default: UserManagementPage };
});

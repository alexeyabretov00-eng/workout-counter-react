import { lazy } from 'react';

export const ChangePasswordPageLazy = lazy(async () => {
  const { ChangePasswordPage } = await import('./ChangePasswordPage');
  return { default: ChangePasswordPage };
});

import { lazy } from 'react';

export const HomePageLazy = lazy(async () => {
  const { HomePage } = await import('./HomePage');
  return { default: HomePage };
});

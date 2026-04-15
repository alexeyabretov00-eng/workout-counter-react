import { lazy } from 'react';

export const ExerciseHistoryPageLazy = lazy(async () => {
  const { ExerciseHistoryPage } = await import('./ExerciseHistoryPage');
  return { default: ExerciseHistoryPage };
});

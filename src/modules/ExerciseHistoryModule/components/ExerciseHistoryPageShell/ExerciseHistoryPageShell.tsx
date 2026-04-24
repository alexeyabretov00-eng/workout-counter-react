import type { ReactNode } from 'react';

import { ModuleScaffold } from '@components';

export type ExerciseHistoryPageShellProps = {
  title: string;
  children: ReactNode;
};

export const ExerciseHistoryPageShell = ({ title, children }: ExerciseHistoryPageShellProps) => {
  return <ModuleScaffold title={title}>{children}</ModuleScaffold>;
};

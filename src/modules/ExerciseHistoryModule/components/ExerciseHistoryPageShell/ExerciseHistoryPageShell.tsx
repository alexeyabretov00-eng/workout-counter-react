import type { ReactNode } from 'react';

import {
  ExerciseHistoryPageRoot,
  ExerciseHistoryPageTitle,
} from './ExerciseHistoryPageShell.styled';

export type ExerciseHistoryPageShellProps = {
  title: string;
  children: ReactNode;
};

export const ExerciseHistoryPageShell = ({ title, children }: ExerciseHistoryPageShellProps) => {
  return (
    <ExerciseHistoryPageRoot>
      <ExerciseHistoryPageTitle>{title}</ExerciseHistoryPageTitle>
      {children}
    </ExerciseHistoryPageRoot>
  );
};

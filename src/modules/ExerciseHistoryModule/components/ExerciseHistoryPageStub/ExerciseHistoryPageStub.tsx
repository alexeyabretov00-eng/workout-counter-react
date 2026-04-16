import { ExerciseHistoryPageLead } from './ExerciseHistoryPageStub.styled';

export type ExerciseHistoryPageStubProps = {
  lead: string;
};

export const ExerciseHistoryPageStub = ({ lead }: ExerciseHistoryPageStubProps) => {
  return <ExerciseHistoryPageLead>{lead}</ExerciseHistoryPageLead>;
};

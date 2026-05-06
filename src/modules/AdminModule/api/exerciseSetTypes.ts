export type ExerciseSetDto = {
  id: number;
  name: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  userId: number;
  userLogin: string;
  createdByUserId: number;
  createdByUserLogin: string;
  exerciseIds: number[];
  createdAt: string;
};

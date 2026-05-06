import type { ExerciseDto } from '@api';

import type { AssignableUserDto } from '../api';
import type { ExerciseSetDto } from '../api';

export type AdminExerciseFormValues = {
  slug: string;
  name: string;
  description: string;
  detectorKey: string;
  voiceAliases: string;
  sortOrder: number;
  isActive: boolean;
};

export type AdminModuleState = {
  exercises: ExerciseDto[];
  exerciseSets: ExerciseSetDto[];
  assignableUsers: AssignableUserDto[];
  isLoading: boolean;
  isSetsLoading: boolean;
  isSubmitting: boolean;
  isSetSubmitting: boolean;
};

export type AdminExerciseSetFormValues = {
  name: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  exerciseIds: number[];
  userId?: number;
};

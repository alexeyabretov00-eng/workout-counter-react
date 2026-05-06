import type { ExerciseDto } from '@api';

import type { AssignableUserDto } from '../../api';
import type { ExerciseSetDto } from '../../api';

export type ExerciseSetManagerValues = {
  name: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  exerciseIds: number[];
  userId?: number;
};

export type ExerciseSetManagerProps = {
  exercises: ExerciseDto[];
  exerciseSets: ExerciseSetDto[];
  assignableUsers: AssignableUserDto[];
  currentUserRole: 'user' | 'admin' | 'superadmin';
  isLoading: boolean;
  isSubmitting: boolean;
  onCreate: (values: ExerciseSetManagerValues) => Promise<void>;
  onUpdate: (id: number, values: ExerciseSetManagerValues) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

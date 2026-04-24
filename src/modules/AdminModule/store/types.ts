import type { ExerciseDto } from '@api';

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
  isLoading: boolean;
  isSubmitting: boolean;
};

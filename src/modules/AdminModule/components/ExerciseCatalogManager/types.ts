import type { ExerciseDto } from '@api';

export type ExerciseCatalogManagerValues = {
  slug: string;
  name: string;
  description: string;
  detectorKey: string;
  voiceAliases: string;
  sortOrder: number;
  isActive: boolean;
};

export type ExerciseCatalogManagerProps = {
  exercises: ExerciseDto[];
  isLoading: boolean;
  isSubmitting: boolean;
  onCreate: (values: ExerciseCatalogManagerValues) => Promise<void>;
  onUpdate: (id: number, values: ExerciseCatalogManagerValues) => Promise<void>;
  onArchive: (id: number) => Promise<void>;
};

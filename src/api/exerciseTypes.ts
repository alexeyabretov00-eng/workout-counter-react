export type ExerciseDto = {
  id: number;
  slug: string;
  name: string;
  description: string;
  detectorKey: string;
  voiceAliases: string[];
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

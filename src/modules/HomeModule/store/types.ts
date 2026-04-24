import type { EntityStatus, SessionStatus, VoiceStatus } from '@types';

export type HomeModuleExerciseCatalogEntry = {
  id: string;
  detectorId: string;
  name: string;
  voiceAliases: string[];
};

export type HomeModuleState = {
  modelStatus: EntityStatus;
  modelLoadingProgress: number | null;
  sessionStatus: SessionStatus;
  cameraStatus: EntityStatus;
  voiceStatus: VoiceStatus;
  cameraError: string | null;
  exerciseId: string;
  exerciseCatalogEntries: HomeModuleExerciseCatalogEntry[];
  restDurationMinutes: number;
  resetStopEnabled: boolean;
};

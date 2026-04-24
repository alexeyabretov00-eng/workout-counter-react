import type { EntityStatus, SessionStatus, VoiceStatus } from '@types';

export type HomeModuleState = {
  modelStatus: EntityStatus;
  modelLoadingProgress: number | null;
  sessionStatus: SessionStatus;
  cameraStatus: EntityStatus;
  voiceStatus: VoiceStatus;
  cameraError: string | null;
  exerciseId: string;
  restDurationMinutes: number;
  resetStopEnabled: boolean;
};

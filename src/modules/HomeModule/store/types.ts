import type { EntityStatus, VoiceStatus } from '@types';

export type HomeModuleState = {
  modelStatus: EntityStatus;
  cameraStatus: EntityStatus;
  voiceStatus: VoiceStatus;
  isPaused: boolean;
  cameraError: string | null;
  exerciseId: string;
  restDurationMinutes: number;
  isRunning: boolean;
  resetStopEnabled: boolean;
  isModelReady: boolean;
};

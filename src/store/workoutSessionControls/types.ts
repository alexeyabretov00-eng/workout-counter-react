import type { EntityStatus, VoiceStatus } from '@types';

/** Состояние панели и статусов сессии тренировки в Redux. */
export type WorkoutSessionControlsState = {
  modelStatus: EntityStatus;
  isCameraReady: boolean;
  voiceStatus: VoiceStatus;
  isPaused: boolean;
  cameraError: string | null;
  exerciseId: string;
  restDurationMinutes: number;
  isRunning: boolean;
  resetStopEnabled: boolean;
  isModelReady: boolean;
  isCameraInitializing: boolean;
};

/** Совместимое имя с прежним контекстом. */
export type WorkoutSessionControlsStatusValue = WorkoutSessionControlsState;

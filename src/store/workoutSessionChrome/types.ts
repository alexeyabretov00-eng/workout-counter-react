import type { EntityStatus, VoiceStatus } from '@types';

/** Состояние «хрома» сессии тренировки (модель, камера, голос, пауза) в Redux. */
export type WorkoutSessionChromeState = {
  modelStatus: EntityStatus;
  isCameraReady: boolean;
  voiceStatus: VoiceStatus;
  isPaused: boolean;
  cameraError: string | null;
};

/** Совместимое имя с прежним контекстом. */
export type WorkoutSessionChromeStatusValue = WorkoutSessionChromeState;

import { createSelector } from '@reduxjs/toolkit';
import type { EntityStatus, VoiceStatus } from '@types';

import { selectWorkoutSessionChrome } from '@store';

const VOICE_STATUS_LABEL: Record<VoiceStatus, string> = {
  unsupported: 'Голос: не поддерживается',
  starting: 'Голос: запуск',
  listening: 'Голос: слушаю',
  'inactive-tab': 'Голос: переключитесь на эту вкладку',
  blocked: 'Голос: доступ к микрофону запрещен',
  error: 'Голос: ошибка распознавания',
};

const MODEL_STATUS_LABEL: Record<EntityStatus, string> = {
  idle: 'ожидание',
  initializing: 'инициализация',
  loading: 'загружается',
  ready: 'загружена',
  error: 'не загружена',
};

export type StatusBarContainerModel = {
  modelStatus: EntityStatus;
  modelStatusLabel: string;
  isCameraReady: boolean;
  voiceStatus: VoiceStatus;
  voiceStatusLabel: string;
  isPaused: boolean;
  cameraError: string | null;
};

export const selectStatusBarContainerModel = createSelector(
  [selectWorkoutSessionChrome],
  (chrome): StatusBarContainerModel => ({
    modelStatus: chrome.modelStatus,
    modelStatusLabel: MODEL_STATUS_LABEL[chrome.modelStatus],
    isCameraReady: chrome.isCameraReady,
    voiceStatus: chrome.voiceStatus,
    voiceStatusLabel: VOICE_STATUS_LABEL[chrome.voiceStatus],
    isPaused: chrome.isPaused,
    cameraError: chrome.cameraError,
  }),
);

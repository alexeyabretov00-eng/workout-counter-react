import { createSelector } from '@reduxjs/toolkit';
import type { EntityStatus, VoiceStatus } from '@types';

import { selectWorkoutSessionControls } from '@store';

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

export const getStatusBarContainerProps = createSelector(
  [selectWorkoutSessionControls],
  controls => ({
    modelStatus: controls.modelStatus,
    modelStatusLabel: MODEL_STATUS_LABEL[controls.modelStatus],
    isCameraReady: controls.isCameraReady,
    voiceStatus: controls.voiceStatus,
    voiceStatusLabel: VOICE_STATUS_LABEL[controls.voiceStatus],
    isPaused: controls.isPaused,
    cameraError: controls.cameraError,
  }),
);

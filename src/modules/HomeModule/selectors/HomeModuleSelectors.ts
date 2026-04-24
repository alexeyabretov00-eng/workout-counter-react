import { createSelector } from '@reduxjs/toolkit';
import type { EntityStatus, VoiceStatus } from '@types';

import type { HomeModuleState } from '../store/types';

type HomeModuleSliceState = { home: HomeModuleState };

export const getWorkoutControlsState = (state: HomeModuleSliceState) => state.home;

export const getHomeModuleProps = createSelector([getWorkoutControlsState], controls => ({
  exerciseId: controls.exerciseId,
  restDurationMinutes: controls.restDurationMinutes,
  isCameraInitializing: controls.cameraStatus === 'initializing',
  isModelReady: controls.modelStatus === 'ready',
}));

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

export const getWorkoutStatusBarContainerProps = createSelector(
  [getWorkoutControlsState],
  controls => ({
    modelStatus: controls.modelStatus,
    modelStatusLabel:
      controls.modelStatus === 'loading'
        ? controls.modelLoadingProgress !== null
          ? `${MODEL_STATUS_LABEL[controls.modelStatus]} (${controls.modelLoadingProgress}%)`
          : `${MODEL_STATUS_LABEL[controls.modelStatus]}...`
        : MODEL_STATUS_LABEL[controls.modelStatus],
    isCameraReady: controls.cameraStatus === 'ready',
    voiceStatus: controls.voiceStatus,
    voiceStatusLabel: VOICE_STATUS_LABEL[controls.voiceStatus],
    isPaused: controls.sessionStatus === 'paused',
    cameraError: controls.cameraError,
  }),
);

const REST_DURATION_MINUTES = [1, 2, 3, 5] as const;

const REST_DURATION_OPTIONS = REST_DURATION_MINUTES.map(minutes => ({
  value: String(minutes),
  label: `${minutes} мин`,
}));

export const getExerciseControlBarContainerProps = createSelector(
  [getWorkoutControlsState],
  controls => ({
    exerciseId: controls.exerciseId,
    restDurationMinutes: controls.restDurationMinutes,
    restDurationOptions: REST_DURATION_OPTIONS,
    isRunning: controls.sessionStatus === 'running',
    isModelReady: controls.modelStatus === 'ready',
    isCameraInitializing: controls.cameraStatus === 'initializing',
    resetStopEnabled: controls.resetStopEnabled,
  }),
);

export const getStageContainerProps = createSelector([getWorkoutControlsState], controls => ({
  isCameraInitializing: controls.cameraStatus === 'initializing',
  isPaused: controls.sessionStatus === 'paused',
}));

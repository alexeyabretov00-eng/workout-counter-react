import { describe, expect, test } from 'vitest';

import { setupStore } from '@store';

import { selectStatusBarContainerModel } from '../StatusBarContainerSelector';

describe('selectStatusBarContainerModel', () => {
  test('maps workout session chrome to status bar model', () => {
    const store = setupStore({
      workoutSessionChrome: {
        modelStatus: 'ready',
        isCameraReady: true,
        voiceStatus: 'listening',
        isPaused: false,
        cameraError: null,
      },
    });

    expect(selectStatusBarContainerModel(store.getState())).toEqual({
      modelStatus: 'ready',
      modelStatusLabel: 'загружена',
      isCameraReady: true,
      voiceStatus: 'listening',
      voiceStatusLabel: 'Голос: слушаю',
      isPaused: false,
      cameraError: null,
    });
  });
});

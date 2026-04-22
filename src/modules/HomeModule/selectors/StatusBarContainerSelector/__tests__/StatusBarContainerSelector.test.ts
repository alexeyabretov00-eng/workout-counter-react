import { describe, expect, test } from 'vitest';

import { initialWorkoutSessionControlsState, setupStore } from '@store';

import { getStatusBarContainerProps } from '../StatusBarContainerSelector';

describe('getStatusBarContainerProps', () => {
  test('maps workout session controls to status bar model', () => {
    const store = setupStore({
      workoutSessionControls: {
        ...initialWorkoutSessionControlsState,
        modelStatus: 'ready',
        isCameraReady: true,
        voiceStatus: 'listening',
        isPaused: false,
        cameraError: null,
      },
    });

    expect(getStatusBarContainerProps(store.getState())).toEqual({
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

import { describe, expect, test } from 'vitest';

import { setupStore } from '@store';

import { initialHomeModuleState } from '../../store';
import {
  getExerciseControlBarContainerProps,
  getHomeModuleProps,
  getStatusBarContainerProps,
} from '../HomeModuleSelectors';

describe('getHomeModuleProps', () => {
  test('maps exerciseId, rest duration, and camera initializing flag from workout controls', () => {
    const store = setupStore({
      home: {
        ...initialHomeModuleState,
        exerciseId: 'biceps-curl',
        restDurationMinutes: 2,
        cameraStatus: 'initializing',
      },
    });

    expect(getHomeModuleProps(store.getState())).toEqual({
      exerciseId: 'biceps-curl',
      restDurationMinutes: 2,
      isCameraInitializing: true,
    });
  });

  test('isCameraInitializing is false when camera is not initializing', () => {
    const store = setupStore({
      home: {
        ...initialHomeModuleState,
        cameraStatus: 'ready',
      },
    });

    expect(getHomeModuleProps(store.getState()).isCameraInitializing).toBe(false);
  });
});

describe('getStatusBarContainerProps', () => {
  test('maps workout controls to status bar model with labels', () => {
    const store = setupStore({
      home: {
        ...initialHomeModuleState,
        modelStatus: 'ready',
        cameraStatus: 'ready',
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

  test('isCameraReady is false when camera is not ready', () => {
    const store = setupStore({
      home: {
        ...initialHomeModuleState,
        cameraStatus: 'initializing',
      },
    });

    expect(getStatusBarContainerProps(store.getState()).isCameraReady).toBe(false);
  });
});

describe('getExerciseControlBarContainerProps', () => {
  test('maps workout controls to exercise control bar model with rest options', () => {
    const store = setupStore({
      home: {
        ...initialHomeModuleState,
        exerciseId: 'biceps-curl',
        restDurationMinutes: 2,
        isRunning: true,
        resetStopEnabled: true,
        isModelReady: true,
        cameraStatus: 'idle',
      },
    });

    expect(getExerciseControlBarContainerProps(store.getState())).toEqual({
      exerciseId: 'biceps-curl',
      restDurationMinutes: 2,
      restDurationOptions: [
        { value: '1', label: '1 мин' },
        { value: '2', label: '2 мин' },
        { value: '3', label: '3 мин' },
        { value: '5', label: '5 мин' },
      ],
      isRunning: true,
      isModelReady: true,
      isCameraInitializing: false,
      resetStopEnabled: true,
    });
  });

  test('isCameraInitializing follows cameraStatus', () => {
    const store = setupStore({
      home: {
        ...initialHomeModuleState,
        cameraStatus: 'initializing',
      },
    });

    expect(getExerciseControlBarContainerProps(store.getState()).isCameraInitializing).toBe(true);
  });
});

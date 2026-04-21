import { describe, expect, test } from 'vitest';

import {
  initialWorkoutSessionChromeState,
  resetWorkoutSessionChrome,
  setWorkoutSessionChrome,
  workoutSessionChromeReducer,
} from '../workoutSessionChromeSlice';

describe('workoutSessionChromeReducer', () => {
  test('returns initial state', () => {
    expect(workoutSessionChromeReducer(undefined, { type: '@@unknown' })).toEqual(
      initialWorkoutSessionChromeState,
    );
  });

  test('setWorkoutSessionChrome replaces state', () => {
    const next = workoutSessionChromeReducer(
      initialWorkoutSessionChromeState,
      setWorkoutSessionChrome({
        modelStatus: 'ready',
        isCameraReady: true,
        voiceStatus: 'listening',
        isPaused: true,
        cameraError: null,
      }),
    );
    expect(next.modelStatus).toBe('ready');
    expect(next.isPaused).toBe(true);
  });

  test('resetWorkoutSessionChrome restores initial', () => {
    const dirty = workoutSessionChromeReducer(
      initialWorkoutSessionChromeState,
      setWorkoutSessionChrome({
        modelStatus: 'error',
        isCameraReady: false,
        voiceStatus: 'error',
        isPaused: true,
        cameraError: 'err',
      }),
    );
    expect(dirty.cameraError).toBe('err');

    const reset = workoutSessionChromeReducer(dirty, resetWorkoutSessionChrome());
    expect(reset).toEqual(initialWorkoutSessionChromeState);
  });
});

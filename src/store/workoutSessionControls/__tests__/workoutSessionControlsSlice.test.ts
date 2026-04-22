import { describe, expect, test } from 'vitest';

import {
  initialWorkoutSessionControlsState,
  patchWorkoutSessionControls,
  resetWorkoutSessionControls,
  setWorkoutSessionControls,
  workoutSessionControlsReducer,
} from '../workoutSessionControlsSlice';

describe('workoutSessionControlsReducer', () => {
  test('returns initial state', () => {
    expect(workoutSessionControlsReducer(undefined, { type: '@@unknown' })).toEqual(
      initialWorkoutSessionControlsState,
    );
  });

  test('setWorkoutSessionControls replaces state', () => {
    const next = workoutSessionControlsReducer(
      initialWorkoutSessionControlsState,
      setWorkoutSessionControls({
        ...initialWorkoutSessionControlsState,
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

  test('patchWorkoutSessionControls merges partial updates', () => {
    const patched = workoutSessionControlsReducer(
      initialWorkoutSessionControlsState,
      patchWorkoutSessionControls({ exerciseId: 'squat', restDurationMinutes: 5 }),
    );
    expect(patched.exerciseId).toBe('squat');
    expect(patched.restDurationMinutes).toBe(5);
    expect(patched.modelStatus).toBe(initialWorkoutSessionControlsState.modelStatus);
  });

  test('resetWorkoutSessionControls restores initial', () => {
    const dirty = workoutSessionControlsReducer(
      initialWorkoutSessionControlsState,
      setWorkoutSessionControls({
        ...initialWorkoutSessionControlsState,
        modelStatus: 'error',
        isCameraReady: false,
        voiceStatus: 'error',
        isPaused: true,
        cameraError: 'err',
        exerciseId: 'squat',
      }),
    );
    expect(dirty.cameraError).toBe('err');

    const reset = workoutSessionControlsReducer(dirty, resetWorkoutSessionControls());
    expect(reset).toEqual(initialWorkoutSessionControlsState);
  });
});

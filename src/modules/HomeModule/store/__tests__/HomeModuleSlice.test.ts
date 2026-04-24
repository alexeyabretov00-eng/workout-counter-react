import { describe, expect, test } from 'vitest';

import {
  HomeModuleReducer,
  initialHomeModuleState,
  resetHomeModuleState,
  updateHomeModuleState,
} from '../HomeModuleSlice';

describe('HomeModuleReducer', () => {
  test('returns initial state', () => {
    expect(HomeModuleReducer(undefined, { type: '@@unknown' })).toEqual(initialHomeModuleState);
  });

  test('updateHomeModuleState merges partial updates', () => {
    const patched = HomeModuleReducer(
      initialHomeModuleState,
      updateHomeModuleState({ exerciseId: 'squat', restDurationMinutes: 5 }),
    );
    expect(patched.exerciseId).toBe('squat');
    expect(patched.restDurationMinutes).toBe(5);
    expect(patched.modelStatus).toBe(initialHomeModuleState.modelStatus);
  });

  test('resetHomeModuleState restores initial', () => {
    const dirty = HomeModuleReducer(
      initialHomeModuleState,
      updateHomeModuleState({
        ...initialHomeModuleState,
        modelStatus: 'error',
        cameraStatus: 'idle',
        voiceStatus: 'error',
        sessionStatus: 'paused',
        cameraError: 'err',
        exerciseId: 'squat',
      }),
    );
    expect(dirty.cameraError).toBe('err');

    const reset = HomeModuleReducer(dirty, resetHomeModuleState());
    expect(reset).toEqual(initialHomeModuleState);
  });
});

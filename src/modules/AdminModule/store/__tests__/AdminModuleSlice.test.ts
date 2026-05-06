import { describe, expect, test } from 'vitest';

import { AdminModuleReducer, initialAdminModuleState } from '../AdminModuleSlice';

describe('AdminModuleReducer', () => {
  test('returns initial state', () => {
    expect(AdminModuleReducer(undefined, { type: '@@unknown' })).toEqual(initialAdminModuleState);
  });

  test('keeps loading/submitting defaults', () => {
    expect(initialAdminModuleState.isLoading).toBe(false);
    expect(initialAdminModuleState.isSetsLoading).toBe(false);
    expect(initialAdminModuleState.isSubmitting).toBe(false);
    expect(initialAdminModuleState.isSetSubmitting).toBe(false);
    expect(initialAdminModuleState.exercises).toEqual([]);
    expect(initialAdminModuleState.exerciseSets).toEqual([]);
  });
});

import { describe, expect, test } from 'vitest';

import {
  initialUserManagementModuleState,
  UserManagementModuleReducer,
} from '../UserManagementModuleSlice';

describe('UserManagementModuleReducer', () => {
  test('returns initial state', () => {
    expect(UserManagementModuleReducer(undefined, { type: '@@unknown' })).toEqual(
      initialUserManagementModuleState,
    );
  });

  test('keeps default values for state fields', () => {
    expect(initialUserManagementModuleState.users).toEqual([]);
    expect(initialUserManagementModuleState.isLoading).toBe(false);
    expect(initialUserManagementModuleState.error).toBeNull();
    expect(initialUserManagementModuleState.isUpdatingByUserId).toEqual({});
  });
});

import { createSelector } from '@reduxjs/toolkit';
import type { AuthState } from '@store';

import { initialUserManagementModuleState, type UserManagementModuleState } from '../store';

type AuthSliceState = { auth?: AuthState };
type UserManagementModuleSliceState = { userManagement?: UserManagementModuleState };

const selectAuthUser = (state: AuthSliceState) => state.auth?.user ?? null;

export const getUserManagementModuleState = (state: UserManagementModuleSliceState) =>
  state.userManagement ?? initialUserManagementModuleState;

export const getUserManagementModuleProps = createSelector(
  [getUserManagementModuleState],
  userManagement => ({
    users: userManagement.users,
    isLoading: userManagement.isLoading,
    error: userManagement.error,
    isUpdatingByUserId: userManagement.isUpdatingByUserId,
  }),
);

export const getUserManagementTableContainerProps = createSelector(
  [selectAuthUser, getUserManagementModuleProps],
  (authUser, userManagementProps) => ({
    currentUserId: authUser?.id ?? null,
    users: userManagementProps.users,
    isLoading: userManagementProps.isLoading,
    isUpdatingByUserId: userManagementProps.isUpdatingByUserId,
  }),
);

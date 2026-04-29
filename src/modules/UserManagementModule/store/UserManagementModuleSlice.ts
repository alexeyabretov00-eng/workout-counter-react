import { createSlice } from '@reduxjs/toolkit';

import type { UserManagementModuleState } from './types';
import {
  fetchManagedUsers,
  resetManagedUserPassword,
  updateManagedUserRole,
} from './UserManagementModuleThunks';

export const initialUserManagementModuleState: UserManagementModuleState = {
  users: [],
  isLoading: false,
  error: null,
  isUpdatingByUserId: {},
};

export const UserManagementModuleSlice = createSlice({
  name: 'UserManagementModuleSlice',
  initialState: initialUserManagementModuleState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchManagedUsers.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchManagedUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchManagedUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить пользователей.';
      })
      .addCase(updateManagedUserRole.pending, (state, action) => {
        state.isUpdatingByUserId[action.meta.arg.id] = true;
      })
      .addCase(updateManagedUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map(user => (user.id === updatedUser.id ? updatedUser : user));
        state.isUpdatingByUserId[updatedUser.id] = false;
      })
      .addCase(updateManagedUserRole.rejected, (state, action) => {
        state.isUpdatingByUserId[action.meta.arg.id] = false;
        state.error = action.payload ?? state.error;
      })
      .addCase(resetManagedUserPassword.pending, (state, action) => {
        state.isUpdatingByUserId[action.meta.arg.id] = true;
      })
      .addCase(resetManagedUserPassword.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map(user => (user.id === updatedUser.id ? updatedUser : user));
        state.isUpdatingByUserId[updatedUser.id] = false;
      })
      .addCase(resetManagedUserPassword.rejected, (state, action) => {
        state.isUpdatingByUserId[action.meta.arg.id] = false;
        state.error = action.payload ?? state.error;
      });
  },
});

export const UserManagementModuleReducer = UserManagementModuleSlice.reducer;

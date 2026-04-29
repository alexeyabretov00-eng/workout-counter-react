import { createAsyncThunk } from '@reduxjs/toolkit';

import { ApiRequestError } from '@api';

import { userManagementClient } from '../api';

import type { ManagedUser, UserRole } from './types';

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  return fallback;
};

export const fetchManagedUsers = createAsyncThunk<ManagedUser[], void, { rejectValue: string }>(
  'userManagement/fetchManagedUsers',
  async (_, { rejectWithValue }) => {
    try {
      const result = await userManagementClient.listUsers();
      return result.users;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Не удалось загрузить пользователей.'));
    }
  },
);

export const updateManagedUserRole = createAsyncThunk<
  ManagedUser,
  { id: number; role: UserRole },
  { rejectValue: string }
>('userManagement/updateManagedUserRole', async ({ id, role }, { rejectWithValue }) => {
  try {
    const result = await userManagementClient.updateUserRole(id, role);
    return result.user;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, 'Не удалось изменить роль пользователя.'));
  }
});

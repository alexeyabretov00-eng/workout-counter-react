import { createAsyncThunk } from '@reduxjs/toolkit';

import { authClient } from '@api';

import type { AuthUser } from './types';

export const initializeAuth = createAsyncThunk<{ user: AuthUser | null }, void>(
  'auth/initialize',
  async () => {
    try {
      const result = await authClient.me();
      return { user: result?.user ?? null };
    } catch {
      return { user: null };
    }
  },
);

export const loginWithPassword = createAsyncThunk(
  'auth/login',
  async ({ login, password }: { login: string; password: string }) => {
    const result = await authClient.login(login, password);
    return { user: result.user };
  },
);

export const registerWithPassword = createAsyncThunk(
  'auth/register',
  async ({ login, password }: { login: string; password: string }) => {
    const result = await authClient.register(login, password);
    return { user: result.user };
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authClient.logout();
});

export const refreshSession = createAsyncThunk<{ user: AuthUser | null }, void>(
  'auth/refresh',
  async () => {
    try {
      const result = await authClient.me();
      return { user: result?.user ?? null };
    } catch {
      return { user: null };
    }
  },
);

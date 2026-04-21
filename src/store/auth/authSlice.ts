import { createSlice } from '@reduxjs/toolkit';

import {
  initializeAuth,
  loginWithPassword,
  logout,
  refreshSession,
  registerWithPassword,
} from './authThunks';
import type { AuthState } from './types';

const initialState: AuthState = {
  user: null,
  status: 'loading',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.status = 'ready';
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(registerWithPassword.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(logout.fulfilled, state => {
        state.user = null;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});

export const authReducer = authSlice.reducer;

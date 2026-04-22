import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { authReducer } from './auth';
import { workoutSessionControlsReducer } from './workoutSessionControls';

const rootReducer = combineReducers({
  auth: authReducer,
  workoutSessionControls: workoutSessionControlsReducer,
});

const devToolsOptions = import.meta.env.DEV ? { name: 'workout-counter' } : false;

export const store = configureStore({
  reducer: rootReducer,
  devTools: devToolsOptions,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    devTools: devToolsOptions,
  });

import { configureStore } from '@reduxjs/toolkit';

import { authReducer, logout } from './auth';
import { ReducerRegistry } from './reducerRegistry';

const devToolsOptions = import.meta.env.DEV ? { name: 'workout-counter' } : false;

const createConfiguredStore = (preloadedState?: Partial<Record<string, unknown>>) => {
  const reducerRegistry = new ReducerRegistry({
    auth: authReducer,
  });

  reducerRegistry.load();
  const appReducer = reducerRegistry.createReducer();
  const rootReducer: typeof appReducer = (state, action) => {
    if (action.type === logout.fulfilled.type) {
      const resetState = appReducer(undefined, { type: '@@INIT' });

      return {
        ...resetState,
        auth: {
          ...resetState.auth,
          status: 'ready',
          user: null,
        },
      };
    }

    return appReducer(state, action);
  };

  return configureStore({
    devTools: devToolsOptions,
    preloadedState,
    reducer: rootReducer,
  });
};

export const store = createConfiguredStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const setupStore = (preloadedState?: Partial<RootState>) =>
  createConfiguredStore(preloadedState);

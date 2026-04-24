import {
  combineReducers,
  configureStore,
  type ConfigureStoreOptions,
  type Reducer,
  type ReducersMapObject,
} from '@reduxjs/toolkit';

type ReducerRegistration = {
  name: string;
  value: Reducer;
};

type ModuleEntry = {
  reducer?: ReducerRegistration;
};

export class ReducerRegistry {
  private readonly staticReducers: ReducersMapObject;
  private readonly dynamicReducers: ReducersMapObject = {};

  constructor(staticReducers: ReducersMapObject) {
    this.staticReducers = staticReducers;
  }

  private getReducerMap(): ReducersMapObject {
    return {
      ...this.staticReducers,
      ...this.dynamicReducers,
    };
  }

  registerModuleReducer(key: string, reducer: Reducer): void {
    this.dynamicReducers[key] = reducer;
  }

  load(): void {
    Object.keys(this.dynamicReducers).forEach(key => {
      delete this.dynamicReducers[key];
    });

    const moduleEntries = import.meta.glob<ModuleEntry>('../modules/*/index.ts', {
      eager: true,
    });

    Object.values(moduleEntries).forEach(moduleEntry => {
      if (moduleEntry.reducer) {
        this.registerModuleReducer(moduleEntry.reducer.name, moduleEntry.reducer.value);
      }
    });
  }

  createStore(options: Partial<ConfigureStoreOptions> = {}) {
    const reducer = options.reducer ?? this.createReducer();

    return configureStore({
      ...options,
      reducer,
    });
  }

  createReducer() {
    return combineReducers(this.getReducerMap());
  }
}

import { HomeModule } from './HomeModule';
import { HomeModuleReducer, type HomeModuleState } from './store';

export { HomeModule };
export type { HomeModuleState };

export const reducer = {
  name: 'home',
  value: HomeModuleReducer,
};

import { HomeModule } from './HomeModule';
import { HomeModuleReducer } from './store';

export { HomeModule };

export const reducer = {
  name: 'home',
  value: HomeModuleReducer,
};

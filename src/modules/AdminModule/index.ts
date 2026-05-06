import { AdminModule } from './AdminModule';
import { AdminModuleReducer } from './store';

export { AdminModule };

export const reducer = {
  name: 'admin',
  value: AdminModuleReducer,
};

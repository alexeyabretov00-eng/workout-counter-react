import { AdminModule } from './AdminModule';
import {
  AdminModuleReducer,
  type AdminModuleState,
  archiveAdminExercise,
  createAdminExercise,
  fetchAdminExercises,
  updateAdminExercise,
} from './store';

export {
  AdminModule,
  archiveAdminExercise,
  createAdminExercise,
  fetchAdminExercises,
  updateAdminExercise,
};
export type { AdminModuleState };

export const reducer = {
  name: 'admin',
  value: AdminModuleReducer,
};

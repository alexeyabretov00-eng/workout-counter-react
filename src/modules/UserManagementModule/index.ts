import { UserManagementModuleReducer, type UserManagementModuleState } from './store';
import { UserManagementModule } from './UserManagementModule';

export { UserManagementModule };
export type { UserManagementModuleState };

export const reducer = {
  name: 'userManagement',
  value: UserManagementModuleReducer,
};

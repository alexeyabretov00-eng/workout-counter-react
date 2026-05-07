import { UserManagementModuleReducer } from './store';
import { UserManagementModule } from './UserManagementModule';

export { UserManagementModule };

export const reducer = {
  name: 'userManagement',
  value: UserManagementModuleReducer,
};

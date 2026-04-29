import { ModuleScaffold } from '@components';

import { ChangePasswordFormContainer } from './containers';

export const ChangePasswordModule = () => {
  return (
    <ModuleScaffold title="Смена пароля">
      <ChangePasswordFormContainer />
    </ModuleScaffold>
  );
};

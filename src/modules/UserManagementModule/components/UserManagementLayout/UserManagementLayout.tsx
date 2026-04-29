import { Typography } from 'antd';

import { ModuleScaffold } from '@components';

import { ContentSpace } from './UserManagementLayout.styled';

export const UserManagementLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ModuleScaffold title="Управление пользователями">
      <ContentSpace orientation="vertical" size={16}>
        <Typography.Paragraph>
          Доступ только для superadmin. Роли управляют доступом к страницам приложения.
        </Typography.Paragraph>
        {children}
      </ContentSpace>
    </ModuleScaffold>
  );
};

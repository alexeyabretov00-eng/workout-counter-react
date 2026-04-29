import { Popconfirm, Space, Table } from 'antd';

import { ResetPasswordButton, RoleSelect } from './UserManagementTable.styled';
import type { ManagedUserTableRow, UserRole } from './UserManagementTable.types';

export type UserManagementTableProps = {
  users: ManagedUserTableRow[];
  isLoading: boolean;
  currentUserId: number | null;
  isUpdatingByUserId: Record<number, boolean>;
  onRoleChange: (targetUser: ManagedUserTableRow, role: UserRole) => void;
  onResetPassword: (targetUser: ManagedUserTableRow) => void;
};

const ROLE_OPTIONS: Array<{ value: UserRole; label: string }> = [
  { value: 'user', label: 'user' },
  { value: 'admin', label: 'admin' },
  { value: 'superadmin', label: 'superadmin' },
];

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  isLoading,
  currentUserId,
  isUpdatingByUserId,
  onRoleChange,
  onResetPassword,
}) => {
  return (
    <Table<ManagedUserTableRow>
      rowKey="id"
      loading={isLoading}
      dataSource={users}
      pagination={false}
      columns={[
        { title: 'Логин', dataIndex: 'login', key: 'login' },
        { title: 'Дата создания', dataIndex: 'createdAt', key: 'createdAt' },
        {
          title: 'Смена пароля',
          key: 'mustChangePassword',
          render: (_: unknown, user: ManagedUserTableRow) =>
            user.mustChangePassword ? 'Требуется' : 'Не требуется',
        },
        {
          title: 'Управление',
          key: 'actions',
          render: (_: unknown, user: ManagedUserTableRow) => {
            const disableEdit = currentUserId === user.id && user.role === 'superadmin';
            const isPending = Boolean(isUpdatingByUserId[user.id]);
            return (
              <Space size="small">
                <RoleSelect
                  value={user.role}
                  options={ROLE_OPTIONS}
                  disabled={disableEdit || isPending}
                  onChange={value => {
                    onRoleChange(user, value);
                  }}
                />
                <Popconfirm
                  title="Сбросить пароль?"
                  description="Пароль станет 12345678, а смена при следующем входе будет обязательной."
                  okText="Сбросить"
                  cancelText="Отмена"
                  onConfirm={() => {
                    onResetPassword(user);
                  }}
                  disabled={isPending}>
                  <ResetPasswordButton type="default" disabled={isPending}>
                    Сбросить пароль
                  </ResetPasswordButton>
                </Popconfirm>
              </Space>
            );
          },
        },
      ]}
    />
  );
};

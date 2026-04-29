import { Table } from 'antd';

import { RoleSelect } from './UserManagementTable.styled';
import type { ManagedUserTableRow, UserRole } from './UserManagementTable.types';

export type UserManagementTableProps = {
  users: ManagedUserTableRow[];
  isLoading: boolean;
  currentUserId: number | null;
  isUpdatingByUserId: Record<number, boolean>;
  onRoleChange: (targetUser: ManagedUserTableRow, role: UserRole) => void;
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
          title: 'Роль',
          key: 'role',
          render: (_: unknown, user: ManagedUserTableRow) => {
            const disableEdit = currentUserId === user.id && user.role === 'superadmin';
            return (
              <RoleSelect
                value={user.role}
                options={ROLE_OPTIONS}
                disabled={disableEdit || Boolean(isUpdatingByUserId[user.id])}
                onChange={value => {
                  onRoleChange(user, value);
                }}
              />
            );
          },
        },
      ]}
    />
  );
};

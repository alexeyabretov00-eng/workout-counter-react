import { useCallback } from 'react';
import { message } from 'antd';

import { useAppDispatch, useAppSelector } from '@store';

import { UserManagementTable } from '../../components';
import { getUserManagementTableContainerProps } from '../../selectors';
import { type ManagedUser, updateManagedUserRole, type UserRole } from '../../store';

export const UserManagementTableContainer = () => {
  const dispatch = useAppDispatch();
  const { currentUserId, users, isLoading, isUpdatingByUserId } = useAppSelector(
    getUserManagementTableContainerProps,
  );
  const [messageApi, contextHolder] = message.useMessage();

  const handleRoleChange = useCallback(
    async (targetUser: ManagedUser, role: UserRole) => {
      try {
        await dispatch(updateManagedUserRole({ id: targetUser.id, role })).unwrap();
        messageApi.success(`Роль пользователя ${targetUser.login} обновлена.`);
      } catch (errorMessage: unknown) {
        const text =
          typeof errorMessage === 'string'
            ? errorMessage
            : 'Не удалось изменить роль пользователя.';
        messageApi.error(text);
      }
    },
    [dispatch, messageApi],
  );

  return (
    <>
      {contextHolder}
      <UserManagementTable
        users={users}
        isLoading={isLoading}
        currentUserId={currentUserId}
        isUpdatingByUserId={isUpdatingByUserId}
        onRoleChange={handleRoleChange}
      />
    </>
  );
};

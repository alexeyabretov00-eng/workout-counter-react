import { useEffect } from 'react';
import { Alert } from 'antd';

import { useAppDispatch, useAppSelector } from '@store';

import { UserManagementLayout } from './components';
import { UserManagementTableContainer } from './containers';
import { getUserManagementModuleProps } from './selectors';
import { fetchManagedUsers } from './store';

export const UserManagementModule = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector(getUserManagementModuleProps);

  useEffect(() => {
    void dispatch(fetchManagedUsers());
  }, [dispatch]);

  return (
    <UserManagementLayout>
      {error ? <Alert type="error" showIcon title={error} /> : null}
      <UserManagementTableContainer />
    </UserManagementLayout>
  );
};

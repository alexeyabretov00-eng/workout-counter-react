import { navItems } from '@routes';
import { logout, useAppDispatch, useAppSelector } from '@store';

import { AppNav } from '../../components';
import { getAppNavContainerProps } from '../../selectors';

export const AppNavContainer = () => {
  const dispatch = useAppDispatch();
  const { isLoading, user } = useAppSelector(getAppNavContainerProps);
  const items = user ? navItems : [];

  return (
    <AppNav
      items={items}
      isLoading={isLoading}
      user={user}
      onLogout={() => {
        dispatch(logout());
      }}
    />
  );
};

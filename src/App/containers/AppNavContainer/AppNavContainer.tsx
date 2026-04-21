import { navItems } from '@routes';
import { logout, useAppDispatch, useAppSelector } from '@store';

import { AppNav } from '../../components';
import { selectAppNavContainerSession } from '../../selectors';

export const AppNavContainer = () => {
  const dispatch = useAppDispatch();
  const { sessionStatus, navUser } = useAppSelector(selectAppNavContainerSession);
  const items = navUser ? navItems : [];

  return (
    <AppNav
      items={items}
      sessionStatus={sessionStatus}
      user={navUser}
      onLogout={() => {
        void dispatch(logout());
      }}
    />
  );
};

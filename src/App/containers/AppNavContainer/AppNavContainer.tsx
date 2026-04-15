import { useAuthSessionContext } from '@contexts';

import { AppNav, type AppNavItem } from '../../components';

type AppNavContainerProps = {
  items: AppNavItem[];
};

export const AppNavContainer = ({ items }: AppNavContainerProps) => {
  const { user, status, logout } = useAuthSessionContext();

  return (
    <AppNav
      items={items}
      sessionStatus={status}
      user={user ? { login: user.login } : null}
      onLogout={() => {
        void logout();
      }}
    />
  );
};

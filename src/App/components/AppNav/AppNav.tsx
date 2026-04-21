import type { LoadingReadyStatus } from '@types';

import {
  AppNavAuth,
  AppNavLink,
  AppNavMain,
  AppNavRoot,
  AppNavTextButton,
  AppNavUserLabel,
} from './AppNav.styled';

export type AppNavItem = { path: string; label: string; end?: boolean };

export type AppNavProps = {
  items: AppNavItem[];
  sessionStatus: LoadingReadyStatus;
  user: { login: string } | null;
  onLogout: () => void;
};

export const AppNav = ({ items, sessionStatus, user, onLogout }: AppNavProps) => {
  return (
    <AppNavRoot>
      <AppNavMain>
        {items.map(({ path, label, end }) => (
          <AppNavLink key={path} to={path} end={end}>
            {label}
          </AppNavLink>
        ))}
      </AppNavMain>
      <AppNavAuth>
        {sessionStatus === 'loading' ? null : user ? (
          <>
            <AppNavUserLabel>{user.login}</AppNavUserLabel>
            <AppNavTextButton type="button" onClick={onLogout}>
              Выйти
            </AppNavTextButton>
          </>
        ) : (
          <>
            <AppNavLink to="/login">Вход</AppNavLink>
            <AppNavLink to="/register">Регистрация</AppNavLink>
          </>
        )}
      </AppNavAuth>
    </AppNavRoot>
  );
};

import {
  AppNavAuth,
  AppNavLink,
  AppNavMain,
  AppNavRoot,
  AppNavUserLabel,
  ButtonStyled,
} from './AppNav.styled';

export type AppNavItem = { path: string; label: string; end?: boolean };

export type AppNavProps = {
  items: AppNavItem[];
  /** `true` во время начальной загрузки сессии (`/api/me`) — блок входа/выхода скрыт. */
  isLoading: boolean;
  user: { login: string } | null;
  onLogout: () => void;
};

type AppNavAuthContentProps = Pick<AppNavProps, 'isLoading' | 'user' | 'onLogout'>;

const AppNavAuthContent: React.FC<AppNavAuthContentProps> = ({ isLoading, user, onLogout }) => {
  if (isLoading) {
    return null;
  }

  if (user) {
    return (
      <>
        <AppNavUserLabel>{user.login}</AppNavUserLabel>
        <ButtonStyled onClick={onLogout}>Выйти</ButtonStyled>
      </>
    );
  }

  return (
    <>
      <AppNavLink to="/login">Вход</AppNavLink>
      <AppNavLink to="/register">Регистрация</AppNavLink>
    </>
  );
};

export const AppNav: React.FC<AppNavProps> = ({ items, isLoading, user, onLogout }) => {
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
        <AppNavAuthContent isLoading={isLoading} user={user} onLogout={onLogout} />
      </AppNavAuth>
    </AppNavRoot>
  );
};

import { useAuthSessionContext } from '../../../contexts/AuthSession'
import {
  AppNavAuth,
  AppNavLink,
  AppNavMain,
  AppNavRoot,
  AppNavTextButton,
  AppNavUserLabel,
} from './AppNav.styled'

type AppNavProps = {
  items: { path: string; label: string; end?: boolean }[]
}

export const AppNav = ({ items }: AppNavProps) => {
  const { user, status, logout } = useAuthSessionContext()

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
        {status === 'loading' ? null : user ? (
          <>
            <AppNavUserLabel>{user.login}</AppNavUserLabel>
            <AppNavTextButton
              type="button"
              onClick={() => {
                void logout()
              }}
            >
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
  )
}

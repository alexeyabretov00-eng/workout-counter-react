import { ROUTES } from '../../routes'
import { AppNavLink, AppNavRoot } from './AppNav.styled'

export const AppNav = () => {
  return (
    <AppNavRoot>
      <AppNavLink to={ROUTES.HOME} end>
        Главная
      </AppNavLink>
      <AppNavLink to={ROUTES.ADMIN}>Админка</AppNavLink>
      <AppNavLink to={ROUTES.HISTORY}>История</AppNavLink>
    </AppNavRoot>
  )
}

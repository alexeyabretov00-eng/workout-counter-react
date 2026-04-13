import { Outlet } from 'react-router-dom'
import { AppNav } from '../components/AppNav'
import { AppRootLayoutRoot } from './AppPageLayout.styled'
import { navItems } from '../routes'

export const AppPageLayout = () => {
  return (
    <AppRootLayoutRoot>
      <AppNav items={navItems} />
      <Outlet />
    </AppRootLayoutRoot>
  )
}

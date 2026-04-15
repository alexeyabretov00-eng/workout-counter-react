import { AppNavLink, AppNavRoot } from './AppNav.styled'

type AppNavProps = {
  items: { path: string; label: string; end?: boolean }[]
}

export const AppNav = ({ items }: AppNavProps) => {
  return (
    <AppNavRoot>
      {items.map(({ path, label, end }) => (
        <AppNavLink key={path} to={path} end={end}>
          {label}
        </AppNavLink>
      ))}
    </AppNavRoot>
  )
}

import { type RouteObject } from 'react-router'

type AppPageRouteHandle = {
  nav?: {
    label: string
    end?: boolean
    sort?: number
  }
}

type PageIndexModule = {
  routes?: unknown
}

const collectPageRouteObjects = (): RouteObject[] => {
  const pageIndexModules = import.meta.glob<PageIndexModule>('../pages/*/index.tsx', {
    eager: true,
  })
  const list: RouteObject[] = []

  for (const mod of Object.values(pageIndexModules)) {
    if (!Array.isArray(mod.routes) || mod.routes.length === 0) {
      continue
    }
    list.push(...(mod.routes as RouteObject[]))
  }

  return list
}

const buildNavItems = (routes: RouteObject[]) => {
  const items: { path: string; label: string; end?: boolean; sort: number }[] = []
  for (const route of routes) {
    const handle = route.handle as AppPageRouteHandle

    if (!handle?.nav) {
      continue
    }

    items.push({
      path: route.path,
      label: handle.nav.label,
      end: handle.nav.end,
      sort: handle.nav.sort ?? Number.POSITIVE_INFINITY,
    })
  }

  items.sort((left, right) => {
      return left.sort - right.sort
  })

  return items.map(({ path, label, end }) => ({ path, label, end }))
}

export const routes = collectPageRouteObjects()

export const navItems = buildNavItems(routes)

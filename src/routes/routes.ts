import { type RouteObject } from 'react-router';

/** Настройки маршрута страницы (поле `handle` у `RouteObject`). */
export type UserRole = 'user' | 'admin' | 'superadmin';

export type AppPageRouteHandle = {
  /** `public` — доступ без входа (логин, регистрация и т.п.). Иначе маршрут защищён `RequireAuth`. */
  auth?: 'public';
  roles?: UserRole[];
  nav?: {
    label: string;
    end?: boolean;
    sort?: number;
  };
};

type PageIndexModule = {
  routes?: unknown;
};

const collectPageRouteObjects = (): RouteObject[] => {
  const pageIndexModules = import.meta.glob<PageIndexModule>('../pages/*/index.tsx', {
    eager: true,
  });
  const list: RouteObject[] = [];

  for (const mod of Object.values(pageIndexModules)) {
    if (!Array.isArray(mod.routes) || mod.routes.length === 0) {
      continue;
    }
    list.push(...(mod.routes as RouteObject[]));
  }

  return list;
};

const buildNavItems = (routes: RouteObject[]) => {
  const items: { path: string; label: string; end?: boolean; sort: number }[] = [];
  for (const route of routes) {
    const handle = route.handle as AppPageRouteHandle;

    if (!handle?.nav) {
      continue;
    }

    items.push({
      path: route.path ?? '',
      label: handle.nav.label,
      end: handle.nav.end,
      sort: handle.nav.sort ?? Number.POSITIVE_INFINITY,
    });
  }

  items.sort((left, right) => {
    return left.sort - right.sort;
  });

  return items.map(({ path, label, end }) => ({ path, label, end }));
};

const hasRouteAccess = (route: RouteObject, role: UserRole | null): boolean => {
  const allowedRoles = (route.handle as AppPageRouteHandle | undefined)?.roles;

  return role && allowedRoles?.length ? allowedRoles.includes(role) : false;
};

export const routes = collectPageRouteObjects();

const isPublicAuthRoute = (route: RouteObject): boolean => {
  return (route.handle as AppPageRouteHandle)?.auth === 'public';
};

export const publicAuthRoutes = routes.filter(isPublicAuthRoute);

export const protectedAppRoutes = routes.filter(route => {
  return !isPublicAuthRoute(route);
});

export const buildNavItemsByRole = (role: UserRole | null) =>
  buildNavItems(routes.filter(route => hasRouteAccess(route, role)));

export const canAccessRouteForRole = (route: RouteObject, role: UserRole | null) =>
  hasRouteAccess(route, role);

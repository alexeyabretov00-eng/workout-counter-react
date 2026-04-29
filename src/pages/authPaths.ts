/** Публичные маршруты входа/регистрации: единый источник для `RouteObject.path` и навигации на страницах. */
export const LOGIN_PAGE_PATH = '/login';
export const REGISTER_PAGE_PATH = '/register';
export const CHANGE_PASSWORD_PAGE_PATH = '/change-password';
export const HOME_PAGE_PATH = '/home';

/** Куда вести пользователя после успешного входа, регистрации или смены пароля. */
export const resolveAfterAuthPath = (from: unknown): string => {
  if (typeof from !== 'object' || from === null) {
    return HOME_PAGE_PATH;
  }

  const pathname = (from as { pathname?: string }).pathname;
  if (typeof pathname !== 'string' || pathname.length === 0) {
    return HOME_PAGE_PATH;
  }

  if ([LOGIN_PAGE_PATH, REGISTER_PAGE_PATH, CHANGE_PASSWORD_PAGE_PATH].includes(pathname)) {
    return HOME_PAGE_PATH;
  }

  return pathname;
};

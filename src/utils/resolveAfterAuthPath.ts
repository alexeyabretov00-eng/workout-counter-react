/** Куда вести пользователя после успешного входа или регистрации. */
export const resolveAfterAuthPath = (from: unknown): string => {
  if (typeof from !== 'object' || from === null) {
    return '/home';
  }
  const pathname = (from as { pathname?: string }).pathname;
  if (typeof pathname !== 'string' || pathname.length === 0) {
    return '/home';
  }
  if (pathname === '/login' || pathname === '/register') {
    return '/home';
  }
  return pathname;
};

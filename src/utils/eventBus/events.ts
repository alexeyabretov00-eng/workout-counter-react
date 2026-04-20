/** Логические имена типов для `emit` / `on` (без префикса `app:` в DOM). Добавляйте новые события здесь. */
export const EVENT_AUTH_NAVIGATE_AFTER_LOGIN = 'auth:navigate-after-login' as const;

export type AppEventMap = {
  [EVENT_AUTH_NAVIGATE_AFTER_LOGIN]: { path: string };
};

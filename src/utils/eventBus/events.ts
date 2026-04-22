/** Логические имена типов для `emit` / `on` (без префикса `app:` в DOM). Добавляйте новые события здесь. */
export const EVENT_AUTH_NAVIGATE_AFTER_LOGIN = 'auth:navigate-after-login' as const;
export const EVENT_AUTH_NAVIGATE_AFTER_REGISTRATION = 'auth:navigate-after-registration' as const;
/** Перейти на экран регистрации (URL задаёт только страница-подписчик). */
export const EVENT_NAV_GO_TO_REGISTER = 'nav:go-to-register' as const;
/** Перейти на экран входа (URL задаёт только страница-подписчик). */
export const EVENT_NAV_GO_TO_LOGIN = 'nav:go-to-login' as const;

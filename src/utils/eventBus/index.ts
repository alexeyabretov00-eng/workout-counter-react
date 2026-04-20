/**
 * Глобальная шина событий: один экземпляр `eventBus`, транспорт — `CustomEvent` на `window`
 * с префиксом DOM-имени `app:`.
 *
 * Соглашение: **`emit`** вызывают в доменных модулях (намерение без роутера); **`on`** —
 * на страницах и в корневых layout-компонентах, обычно внутри **`useEffect`**, отписка —
 * функция, возвращённая из **`on`**, в cleanup эффекта. Отдельных хуков шины в этом каталоге нет.
 */

export { EventBus, eventBus } from './EventBus';
export { type AppEventMap, EVENT_AUTH_NAVIGATE_AFTER_LOGIN } from './events';
export type { EventHandler } from './types';

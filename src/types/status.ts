/**
 * Два состояния «ожидание / можно работать».
 * Общий тип для среза `auth.status`, пропов навигации и других простых гейтов; не дублировать как отдельный union.
 */
export type LoadingReadyStatus = 'loading' | 'ready';

export type EntityStatus = 'idle' | 'initializing' | LoadingReadyStatus | 'error';

export type SessionStatus = 'idle' | 'running' | 'paused' | 'rest';

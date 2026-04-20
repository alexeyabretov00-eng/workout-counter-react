import type { AppEventMap } from './events';
import type { EventHandler } from './types';

const EVENT_PREFIX = 'app:' as const;

export class EventBus {
  emit<K extends keyof AppEventMap>(type: K, detail: AppEventMap[K]): void;
  emit(type: string, detail?: unknown): void;
  emit(type: string, detail?: unknown): void {
    if (typeof window === 'undefined') {
      return;
    }

    const event = new CustomEvent(`${EVENT_PREFIX}${type}`, { detail });
    window.dispatchEvent(event);
  }

  on<K extends keyof AppEventMap>(type: K, handler: (detail: AppEventMap[K]) => void): () => void;
  on(type: string, handler: EventHandler): () => void;
  on(type: string, handler: EventHandler): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const eventType = `${EVENT_PREFIX}${type}`;
    const wrappedHandler = (event: Event): void => {
      handler((event as CustomEvent).detail);
    };

    window.addEventListener(eventType, wrappedHandler as EventListener);

    return () => {
      window.removeEventListener(eventType, wrappedHandler as EventListener);
    };
  }
}

export const eventBus = new EventBus();

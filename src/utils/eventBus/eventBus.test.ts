import { afterEach, describe, expect, test, vi } from 'vitest';

import { EVENT_AUTH_NAVIGATE_AFTER_LOGIN, eventBus } from './index';

describe('eventBus', () => {
  const cleanups: Array<() => void> = [];

  afterEach(() => {
    while (cleanups.length > 0) {
      cleanups.pop()?.();
    }
    vi.restoreAllMocks();
  });

  test('delivers detail to subscriber on emit', () => {
    const handler = vi.fn();
    cleanups.push(eventBus.on(EVENT_AUTH_NAVIGATE_AFTER_LOGIN, handler));

    eventBus.emit(EVENT_AUTH_NAVIGATE_AFTER_LOGIN, { path: '/history' });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ path: '/history' });
  });

  test('unsubscribe stops delivery', () => {
    const handler = vi.fn();
    const off = eventBus.on(EVENT_AUTH_NAVIGATE_AFTER_LOGIN, handler);
    off();

    eventBus.emit(EVENT_AUTH_NAVIGATE_AFTER_LOGIN, { path: '/home' });

    expect(handler).not.toHaveBeenCalled();
  });

  test('invokes multiple listeners for the same logical type', () => {
    const first = vi.fn();
    const second = vi.fn();
    cleanups.push(eventBus.on(EVENT_AUTH_NAVIGATE_AFTER_LOGIN, first));
    cleanups.push(eventBus.on(EVENT_AUTH_NAVIGATE_AFTER_LOGIN, second));

    eventBus.emit(EVENT_AUTH_NAVIGATE_AFTER_LOGIN, { path: '/home' });

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  test('without window emit is no-op and on returns empty unsubscribe', () => {
    vi.stubGlobal('window', undefined);

    try {
      const handler = vi.fn();
      const off = eventBus.on(EVENT_AUTH_NAVIGATE_AFTER_LOGIN, handler);
      expect(off()).toBeUndefined();

      eventBus.emit(EVENT_AUTH_NAVIGATE_AFTER_LOGIN, { path: '/home' });
      expect(handler).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

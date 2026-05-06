import { afterEach, describe, expect, test, vi } from 'vitest';

import { eventBus } from '..';

const EVENT_AUTH_NAVIGATE_AFTER_LOGIN = 'auth:navigate-after-login';
const EVENT_AUTH_NAVIGATE_AFTER_REGISTRATION = 'auth:navigate-after-registration';
const EVENT_NAV_GO_TO_LOGIN = 'nav:go-to-login';
const EVENT_NAV_GO_TO_REGISTER = 'nav:go-to-register';

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

  test('delivers registration event detail', () => {
    const handler = vi.fn();
    cleanups.push(eventBus.on(EVENT_AUTH_NAVIGATE_AFTER_REGISTRATION, handler));

    eventBus.emit(EVENT_AUTH_NAVIGATE_AFTER_REGISTRATION, { path: '/home' });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ path: '/home' });
  });

  test('go-to-register invokes listener without payload', () => {
    const handler = vi.fn();
    cleanups.push(eventBus.on(EVENT_NAV_GO_TO_REGISTER, handler));

    eventBus.emit(EVENT_NAV_GO_TO_REGISTER);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(null);
  });

  test('go-to-login invokes listener without payload', () => {
    const handler = vi.fn();
    cleanups.push(eventBus.on(EVENT_NAV_GO_TO_LOGIN, handler));

    eventBus.emit(EVENT_NAV_GO_TO_LOGIN);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(null);
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

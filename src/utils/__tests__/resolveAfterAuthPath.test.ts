import { describe, expect, test } from 'vitest';

import { resolveAfterAuthPath } from '../resolveAfterAuthPath';

describe('resolveAfterAuthPath', () => {
  test('returns /home for non-object', () => {
    expect(resolveAfterAuthPath(undefined)).toBe('/home');
    expect(resolveAfterAuthPath('x')).toBe('/home');
  });

  test('returns /home for null', () => {
    expect(resolveAfterAuthPath(null)).toBe('/home');
  });

  test('returns /home when pathname missing or empty', () => {
    expect(resolveAfterAuthPath({})).toBe('/home');
    expect(resolveAfterAuthPath({ pathname: '' })).toBe('/home');
  });

  test('returns /home for login and register paths', () => {
    expect(resolveAfterAuthPath({ pathname: '/login' })).toBe('/home');
    expect(resolveAfterAuthPath({ pathname: '/register' })).toBe('/home');
  });

  test('returns pathname for other routes', () => {
    expect(resolveAfterAuthPath({ pathname: '/history' })).toBe('/history');
  });
});

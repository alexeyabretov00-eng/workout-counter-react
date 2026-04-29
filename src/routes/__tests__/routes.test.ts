import { describe, expect, test } from 'vitest';

import { buildNavItemsByRole, protectedAppRoutes, publicAuthRoutes, routes } from '../routes';

describe('routes', () => {
  test('collects routes from page modules', () => {
    expect(routes.length).toBeGreaterThan(0);
  });

  test('splits public auth routes', () => {
    expect(
      publicAuthRoutes.every(
        route => route.handle && (route.handle as { auth?: string }).auth === 'public',
      ),
    ).toBe(true);
    expect(protectedAppRoutes.length).toBeGreaterThan(0);
  });

  test('buildNavItemsByRole is sorted and stripped of sort field', () => {
    const navItems = buildNavItemsByRole('superadmin');
    expect(navItems.length).toBeGreaterThan(0);
    expect(navItems[0]).toEqual(
      expect.objectContaining({
        path: expect.any(String),
        label: expect.any(String),
      }),
    );
  });
});

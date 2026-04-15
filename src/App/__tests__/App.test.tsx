import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

vi.mock('react-router-dom', async importOriginal => {
  const mod = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...mod,
    RouterProvider: () => <div data-testid="router-provider" />,
    createBrowserRouter: vi.fn(() => ({})),
  };
});

vi.mock('@api', () => ({
  authMe: vi.fn(() => Promise.resolve(null)),
  authLogin: vi.fn(),
  authRegister: vi.fn(),
  authLogout: vi.fn(),
}));

import { App } from '../App';

describe('App', () => {
  test('renders router provider inside theme', () => {
    render(<App />);
    expect(screen.getByTestId('router-provider')).toBeInTheDocument();
  });
});

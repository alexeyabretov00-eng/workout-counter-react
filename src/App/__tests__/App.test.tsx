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
  authClient: {
    me: vi.fn(() => Promise.resolve(null)),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

import { App } from '../App';

describe('App', () => {
  test('renders router provider inside theme', () => {
    render(<App />);
    expect(screen.getByTestId('router-provider')).toBeInTheDocument();
  });
});

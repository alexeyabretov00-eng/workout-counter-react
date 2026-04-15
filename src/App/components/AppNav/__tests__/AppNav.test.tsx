import { Outlet, Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { renderWithRouterTheme } from '@test-helpers';

import { AppNav } from '../AppNav';

const GuestShell = () => (
  <>
    <AppNav
      items={[{ path: '/home', label: 'Главная' }]}
      sessionStatus="ready"
      user={null}
      onLogout={vi.fn()}
    />
    <Outlet />
  </>
);

describe('AppNav', () => {
  test('matches snapshot (guest)', () => {
    const { container } = renderWithRouterTheme(
      <AppNav
        items={[{ path: '/home', label: 'Главная' }]}
        sessionStatus="ready"
        user={null}
        onLogout={vi.fn()}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot (authenticated)', () => {
    const { container } = renderWithRouterTheme(
      <AppNav
        items={[{ path: '/home', label: 'Главная' }]}
        sessionStatus="ready"
        user={{ login: 'alex' }}
        onLogout={vi.fn()}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot (loading hides auth actions)', () => {
    const { container } = renderWithRouterTheme(
      <AppNav items={[]} sessionStatus="loading" user={null} onLogout={vi.fn()} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('вызывает onLogout при клике по кнопке «Выйти»', async () => {
    const onLogout = vi.fn();
    const user = userEvent.setup();

    renderWithRouterTheme(
      <AppNav
        items={[{ path: '/home', label: 'Главная' }]}
        sessionStatus="ready"
        user={{ login: 'alex' }}
        onLogout={onLogout}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Выйти' }));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  test('гость: клик по «Вход» открывает маршрут /login', async () => {
    const user = userEvent.setup();

    renderWithRouterTheme(
      <Routes>
        <Route path="/" element={<GuestShell />}>
          <Route index element={null} />
          <Route path="login" element={<div data-testid="login-route">login</div>} />
        </Route>
      </Routes>,
      { initialEntries: ['/'] },
    );

    await user.click(screen.getByRole('link', { name: 'Вход' }));
    expect(screen.getByTestId('login-route')).toBeInTheDocument();
  });

  test('гость: клик по пункту основного меню ведёт на целевой path', async () => {
    const user = userEvent.setup();

    renderWithRouterTheme(
      <Routes>
        <Route path="/" element={<GuestShell />}>
          <Route path="away" element={<div data-testid="away">away</div>} />
          <Route path="home" element={<div data-testid="home-route">home</div>} />
        </Route>
      </Routes>,
      { initialEntries: ['/away'] },
    );

    expect(screen.getByTestId('away')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Главная' }));
    expect(screen.getByTestId('home-route')).toBeInTheDocument();
  });
});

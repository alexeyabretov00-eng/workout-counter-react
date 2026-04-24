import type { ReactElement, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import { AppStyleProviders } from './appStyleProviders';

const wrap = (ui: ReactElement) => <AppStyleProviders>{ui}</AppStyleProviders>;

export const renderWithTheme = (ui: ReactElement) => {
  return render(wrap(ui));
};

export const renderWithRouterTheme = (
  ui: ReactNode,
  options: { initialEntries?: string[] } = {},
) => {
  const { initialEntries = ['/'] } = options;
  return render(<MemoryRouter initialEntries={initialEntries}>{wrap(<>{ui}</>)}</MemoryRouter>);
};

import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { ModuleScaffold } from '@components';
import { renderWithTheme } from '@test-helpers';

describe('ModuleScaffold', () => {
  test('renders title as top-level heading', () => {
    renderWithTheme(
      <ModuleScaffold title="Заголовок страницы">
        <p>тело</p>
      </ModuleScaffold>,
    );
    const heading = screen.getByRole('heading', { name: 'Заголовок страницы' });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  test('renders children', () => {
    renderWithTheme(
      <ModuleScaffold title="T">
        <p data-testid="child">содержимое</p>
      </ModuleScaffold>,
    );
    expect(screen.getByTestId('child')).toHaveTextContent('содержимое');
  });

  test('matches snapshot', () => {
    const { container } = renderWithTheme(
      <ModuleScaffold title="Снапшот">
        <div>контент</div>
      </ModuleScaffold>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

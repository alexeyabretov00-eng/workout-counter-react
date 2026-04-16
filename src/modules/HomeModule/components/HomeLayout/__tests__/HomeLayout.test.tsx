import { describe, expect, test } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { HomeLayout } from '../HomeLayout';

describe('HomeLayout', () => {
  test('matches snapshot', () => {
    const { container } = renderWithTheme(
      <HomeLayout
        header={<span>header</span>}
        controls={<span>controls</span>}
        statusBar={<span>status</span>}
        stage={<span>stage</span>}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

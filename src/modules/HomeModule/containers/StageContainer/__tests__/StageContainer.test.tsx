import { describe, expect, test, vi } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { StageContainer } from '../StageContainer';

vi.mock('../../../logic', async importOriginal => {
  const actual = await importOriginal<typeof import('../../../logic')>();
  return {
    ...actual,
    useStageContainerSelector: () => ({
      canvasRef: { current: null },
      isCameraInitializing: false,
      isPaused: false,
    }),
  };
});

describe('StageContainer', () => {
  test('matches snapshot', () => {
    const { container } = renderWithTheme(<StageContainer />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

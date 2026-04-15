import { describe, expect, test, vi } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { StatusBarContainer } from '../StatusBarContainer';

vi.mock('../../../logic', async importOriginal => {
  const actual = await importOriginal<typeof import('../../../logic')>();
  return {
    ...actual,
    useStatusBarContainerSelector: () => ({
      modelStatus: 'ready',
      modelStatusLabel: 'загружена',
      isCameraReady: true,
      voiceStatus: 'listening',
      voiceStatusLabel: 'Голос: слушаю',
      isPaused: false,
      cameraError: null,
    }),
  };
});

describe('StatusBarContainer', () => {
  test('matches snapshot', () => {
    const { container } = renderWithTheme(<StatusBarContainer />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

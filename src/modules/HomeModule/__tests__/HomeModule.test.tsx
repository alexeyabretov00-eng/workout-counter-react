import { Provider } from 'react-redux';
import { describe, expect, test, vi } from 'vitest';

import { HomeModule } from '@modules/HomeModule';
import { setupStore } from '@store';
import { renderWithTheme } from '@test-helpers';

vi.mock('../hooks', async importOriginal => {
  const actual = await importOriginal<typeof import('../hooks')>();
  const canvasRef = { current: null };
  return {
    ...actual,
    useWorkoutSession: () => ({
      canvasRef,
      isRunning: false,
      isPaused: false,
      isRestCountdownActive: false,
      modelStatus: 'ready',
      isModelReady: true,
      isCameraReady: true,
      isCameraInitializing: false,
      cameraError: null,
      start: vi.fn(),
      pause: vi.fn(),
      reset: vi.fn(),
      shutdown: vi.fn(),
    }),
    useSpeechRecognition: () => ({ voiceStatus: 'unsupported' }),
  };
});

describe('HomeModule', () => {
  test('renders title and layout regions', () => {
    const testStore = setupStore();
    const { getByText, getByLabelText } = renderWithTheme(
      <Provider store={testStore}>
        <HomeModule />
      </Provider>,
    );
    expect(getByText('Счетчик повторений')).toBeInTheDocument();
    expect(getByLabelText('Старт')).toBeInTheDocument();
  });
});

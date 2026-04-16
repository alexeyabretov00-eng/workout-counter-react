import { describe, expect, test, vi } from 'vitest';

import { HomeModule } from '@modules/HomeModule';
import { renderWithTheme } from '@test-helpers';

vi.mock('../hooks', () => {
  const canvasRef = { current: null };
  return {
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
    const { getByText, getByLabelText } = renderWithTheme(<HomeModule />);
    expect(getByText('Счетчик повторений')).toBeInTheDocument();
    expect(getByLabelText('Старт')).toBeInTheDocument();
  });
});

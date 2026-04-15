import { describe, expect, test, vi } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { HomePage } from '../HomePage';

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

describe('HomePage', () => {
  test('renders title and layout regions', () => {
    const { getByText, getByLabelText } = renderWithTheme(<HomePage />);
    expect(getByText('Счетчик повторений')).toBeInTheDocument();
    expect(getByLabelText('Старт')).toBeInTheDocument();
  });
});

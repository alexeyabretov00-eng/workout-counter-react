import { describe, expect, test, vi } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { WorkoutLogicLayout } from '../WorkoutLogicLayout';

vi.mock('../../../hooks', () => {
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

describe('WorkoutLogicLayout', () => {
  test('provides chrome contexts to children', () => {
    const { getByText } = renderWithTheme(
      <WorkoutLogicLayout>
        <span>child</span>
      </WorkoutLogicLayout>,
    );
    expect(getByText('child')).toBeInTheDocument();
  });
});

import { describe, expect, test } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { WorkoutStatusBar } from '../WorkoutStatusBar';

describe('WorkoutStatusBar', () => {
  test('matches snapshot (full state)', () => {
    const { container } = renderWithTheme(
      <WorkoutStatusBar
        modelStatus="ready"
        modelStatusLabel="ok"
        isCameraReady
        voiceStatus="listening"
        voiceStatusLabel="Voice"
        isPaused
        cameraError="boom"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot (minimal)', () => {
    const { container } = renderWithTheme(
      <WorkoutStatusBar
        modelStatus="loading"
        modelStatusLabel="wait (42%)"
        isCameraReady={false}
        voiceStatus="unsupported"
        voiceStatusLabel="V"
        isPaused={false}
        cameraError={null}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

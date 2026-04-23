import { createRef } from 'react';
import { describe, expect, test } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { WorkoutSessionStageContext, type WorkoutSessionStageValue } from '../../../contexts';
import { StageContainer } from '../StageContainer';

const renderWithStage = (overrides: Partial<WorkoutSessionStageValue> = {}) => {
  const value: WorkoutSessionStageValue = {
    canvasRef: createRef<HTMLCanvasElement>(),
    isCameraInitializing: false,
    isPaused: false,
    ...overrides,
  };
  return renderWithTheme(
    <WorkoutSessionStageContext.Provider value={value}>
      <StageContainer />
    </WorkoutSessionStageContext.Provider>,
  );
};

describe('StageContainer', () => {
  test('matches snapshot (camera loading)', () => {
    const { container } = renderWithStage({ isCameraInitializing: true, isPaused: false });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot (paused)', () => {
    const { container } = renderWithStage({ isCameraInitializing: false, isPaused: true });
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot (live canvas)', () => {
    const { container } = renderWithStage({ isCameraInitializing: false, isPaused: false });
    expect(container.firstChild).toMatchSnapshot();
  });
});

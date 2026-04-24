import { createRef } from 'react';
import { Provider } from 'react-redux';
import { describe, expect, test } from 'vitest';

import { setupStore } from '@store';
import { renderWithTheme } from '@test-helpers';

import { WorkoutSessionStageContext, type WorkoutSessionStageValue } from '../../../contexts';
import { initialHomeModuleState } from '../../../store';
import { StageContainer } from '../StageContainer';

const renderWithStage = ({
  isCameraInitializing = false,
  isPaused = false,
}: {
  isCameraInitializing?: boolean;
  isPaused?: boolean;
} = {}) => {
  const value: WorkoutSessionStageValue = {
    canvasRef: createRef<HTMLCanvasElement>(),
  };
  const testStore = setupStore({
    home: {
      ...initialHomeModuleState,
      cameraStatus: isCameraInitializing ? 'initializing' : 'ready',
      sessionStatus: isPaused ? 'paused' : 'running',
    },
  });
  return renderWithTheme(
    <Provider store={testStore}>
      <WorkoutSessionStageContext.Provider value={value}>
        <StageContainer />
      </WorkoutSessionStageContext.Provider>
    </Provider>,
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

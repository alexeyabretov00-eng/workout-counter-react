import { Provider } from 'react-redux';
import { describe, expect, test } from 'vitest';

import { initialWorkoutSessionControlsState, setupStore } from '@store';
import { renderWithTheme } from '@test-helpers';

import { StatusBarContainer } from '../StatusBarContainer';

const testStore = setupStore({
  workoutSessionControls: {
    ...initialWorkoutSessionControlsState,
    modelStatus: 'ready',
    isCameraReady: true,
    voiceStatus: 'listening',
    isPaused: false,
    cameraError: null,
  },
});

describe('StatusBarContainer', () => {
  test('matches snapshot', () => {
    const { container } = renderWithTheme(
      <Provider store={testStore}>
        <StatusBarContainer />
      </Provider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

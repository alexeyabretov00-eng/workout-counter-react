import { Provider } from 'react-redux';
import { describe, expect, test } from 'vitest';

import { setupStore } from '@store';
import { renderWithTheme } from '@test-helpers';

import { initialHomeModuleState } from '../../../store';
import { WorkoutStatusBarContainer } from '../WorkoutStatusBarContainer';

const testStore = setupStore({
  home: {
    ...initialHomeModuleState,
    modelStatus: 'ready',
    cameraStatus: 'ready',
    voiceStatus: 'listening',
    isPaused: false,
    cameraError: null,
  },
});

describe('WorkoutStatusBarContainer', () => {
  test('matches snapshot', () => {
    const { container } = renderWithTheme(
      <Provider store={testStore}>
        <WorkoutStatusBarContainer />
      </Provider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

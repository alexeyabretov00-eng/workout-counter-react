import { Provider } from 'react-redux';
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, type Mock, test, vi } from 'vitest';

import { setupStore } from '@store';
import { renderWithTheme } from '@test-helpers';
import { eventBus } from '@utils';

import { EVENT_WORKOUT_SESSION_CONTROLS_COMMAND } from '../../../constants';
import { type HomeModuleState, initialHomeModuleState } from '../../../store';
import { ExerciseControlBarContainer } from '../ExerciseControlBarContainer';

const createControlsFixture = (): HomeModuleState => ({
  ...initialHomeModuleState,
  exerciseId: 'biceps-curl' as const,
  exerciseCatalogEntries: [
    {
      id: 'biceps-curl',
      detectorId: 'biceps-curl',
      name: 'Подъем на бицепс',
      voiceAliases: ['бицепс'],
    },
  ],
  restDurationMinutes: 1,
  sessionStatus: 'idle' as const,
  modelStatus: 'ready' as const,
  resetStopEnabled: false,
});

let controlsFixture = createControlsFixture();

describe('ExerciseControlBarContainer', () => {
  let testStore: ReturnType<typeof setupStore>;
  let emitSpy: Mock<(type: string, detail?: unknown) => void>;

  beforeEach(() => {
    controlsFixture = createControlsFixture();
    testStore = setupStore({
      home: controlsFixture,
    });
    emitSpy = vi.spyOn(eventBus, 'emit') as Mock<(type: string, detail?: unknown) => void>;
    emitSpy.mockClear();
  });

  const renderBar = () =>
    renderWithTheme(
      <Provider store={testStore}>
        <ExerciseControlBarContainer />
      </Provider>,
    );

  test('emits start when Старт is clicked', async () => {
    const user = userEvent.setup();
    const { container } = renderBar();
    const region = within(container);
    await user.click(region.getByRole('button', { name: 'Старт' }));
    expect(emitSpy).toHaveBeenCalledWith(EVENT_WORKOUT_SESSION_CONTROLS_COMMAND, { type: 'start' });
  });

  test('emits pause when Пауза is clicked while running', async () => {
    const user = userEvent.setup();
    controlsFixture = { ...createControlsFixture(), sessionStatus: 'running' as const };
    testStore = setupStore({ home: controlsFixture });
    emitSpy = vi.spyOn(eventBus, 'emit') as Mock<(type: string, detail?: unknown) => void>;
    emitSpy.mockClear();
    const { container } = renderBar();
    const region = within(container);
    await user.click(region.getByRole('button', { name: 'Пауза' }));
    expect(emitSpy).toHaveBeenCalledWith(EVENT_WORKOUT_SESSION_CONTROLS_COMMAND, { type: 'pause' });
  });

  test('emits reset and shutdown when enabled', async () => {
    const user = userEvent.setup();
    controlsFixture = {
      ...createControlsFixture(),
      sessionStatus: 'running' as const,
      resetStopEnabled: true,
    };
    testStore = setupStore({ home: controlsFixture });
    emitSpy = vi.spyOn(eventBus, 'emit') as Mock<(type: string, detail?: unknown) => void>;
    emitSpy.mockClear();
    const { container } = renderBar();
    const region = within(container);
    await user.click(region.getByRole('button', { name: 'Сброс' }));
    await user.click(region.getByRole('button', { name: 'Стоп' }));
    expect(emitSpy).toHaveBeenNthCalledWith(1, EVENT_WORKOUT_SESSION_CONTROLS_COMMAND, {
      type: 'reset',
    });
    expect(emitSpy).toHaveBeenNthCalledWith(2, EVENT_WORKOUT_SESSION_CONTROLS_COMMAND, {
      type: 'shutdown',
    });
  });

  test('matches snapshot', () => {
    const { container } = renderBar();
    expect(container.firstChild).toMatchSnapshot();
  });
});

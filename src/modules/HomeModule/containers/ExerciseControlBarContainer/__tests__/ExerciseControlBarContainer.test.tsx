import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { ExerciseControlBarContainer } from '../ExerciseControlBarContainer';

const dispatchChromeControl = vi.fn();

const createSelectorFixture = () => ({
  exerciseId: 'biceps-curl',
  restDurationMinutes: 1,
  restDurationOptions: [
    { value: '1', label: '1 мин' },
    { value: '2', label: '2 мин' },
  ],
  isRunning: false,
  isModelReady: true,
  isCameraInitializing: false,
  resetStopEnabled: false,
});

let selectorFixture = createSelectorFixture();

vi.mock('../../../logic', async importOriginal => {
  const actual = await importOriginal<typeof import('../../../logic')>();
  return {
    ...actual,
    useExerciseControlBarContainerSelector: () => ({
      ...selectorFixture,
      dispatchChromeControl,
    }),
  };
});

describe('ExerciseControlBarContainer', () => {
  beforeEach(() => {
    selectorFixture = createSelectorFixture();
    dispatchChromeControl.mockClear();
  });

  test('dispatches start when Старт is clicked', async () => {
    const user = userEvent.setup();
    const { container } = renderWithTheme(<ExerciseControlBarContainer />);
    const region = within(container);
    await user.click(region.getByRole('button', { name: 'Старт' }));
    expect(dispatchChromeControl).toHaveBeenCalledWith({ type: 'start' });
  });

  test('dispatches pause when Пауза is clicked while running', async () => {
    const user = userEvent.setup();
    selectorFixture.isRunning = true;
    const { container } = renderWithTheme(<ExerciseControlBarContainer />);
    const region = within(container);
    await user.click(region.getByRole('button', { name: 'Пауза' }));
    expect(dispatchChromeControl).toHaveBeenCalledWith({ type: 'pause' });
  });

  test('dispatches reset and shutdown when enabled', async () => {
    const user = userEvent.setup();
    selectorFixture.resetStopEnabled = true;
    const { container } = renderWithTheme(<ExerciseControlBarContainer />);
    const region = within(container);
    await user.click(region.getByRole('button', { name: 'Сброс' }));
    await user.click(region.getByRole('button', { name: 'Стоп' }));
    expect(dispatchChromeControl).toHaveBeenNthCalledWith(1, { type: 'reset' });
    expect(dispatchChromeControl).toHaveBeenNthCalledWith(2, { type: 'shutdown' });
  });

  test('dispatches setExerciseId when another exercise is selected', async () => {
    const user = userEvent.setup();
    const { container } = renderWithTheme(<ExerciseControlBarContainer />);
    const region = within(container);
    // Порядок как в ExerciseControlBar: упражнение, отдых (getByLabelText с styled select не подходит).
    const [exerciseSelect] = region.getAllByRole('combobox');
    await user.selectOptions(exerciseSelect, 'squat');
    expect(dispatchChromeControl).toHaveBeenCalledWith({
      type: 'setExerciseId',
      exerciseId: 'squat',
    });
  });

  test('dispatches setRestDurationMinutes when rest option changes', async () => {
    const user = userEvent.setup();
    const { container } = renderWithTheme(<ExerciseControlBarContainer />);
    const region = within(container);
    const comboboxes = region.getAllByRole('combobox');
    const restSelect = comboboxes[1];
    await user.selectOptions(restSelect, '2');
    expect(dispatchChromeControl).toHaveBeenCalledWith({
      type: 'setRestDurationMinutes',
      minutes: 2,
    });
  });

  test('matches snapshot', () => {
    const { container } = renderWithTheme(<ExerciseControlBarContainer />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

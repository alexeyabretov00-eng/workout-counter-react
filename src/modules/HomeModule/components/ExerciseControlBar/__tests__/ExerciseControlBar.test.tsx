import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { ExerciseControlBar } from '../ExerciseControlBar';

const exerciseOptions = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
];
const restOptions = [
  { value: '1', label: '1m' },
  { value: '2', label: '2m' },
];

describe('ExerciseControlBar', () => {
  test('calls onStartPause, onReset, onShutdown', async () => {
    const user = userEvent.setup();
    const onStartPause = vi.fn();
    const onReset = vi.fn();
    const onShutdown = vi.fn();
    const { container } = renderWithTheme(
      <ExerciseControlBar
        exerciseId="a"
        exerciseOptions={exerciseOptions}
        restDurationMinutes={1}
        restDurationOptions={restOptions}
        isRunning={false}
        isModelReady
        isCameraInitializing={false}
        resetStopEnabled
        onExerciseChange={vi.fn()}
        onStartPause={onStartPause}
        onReset={onReset}
        onShutdown={onShutdown}
        onRestDurationChange={vi.fn()}
      />,
    );
    const region = within(container);
    await user.click(region.getByRole('button', { name: 'Старт' }));
    await user.click(region.getByRole('button', { name: 'Сброс' }));
    await user.click(region.getByRole('button', { name: 'Стоп' }));
    expect(onStartPause).toHaveBeenCalledTimes(1);
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onShutdown).toHaveBeenCalledTimes(1);
  });

  test('calls onStartPause for pause when running', async () => {
    const user = userEvent.setup();
    const onStartPause = vi.fn();
    const { container } = renderWithTheme(
      <ExerciseControlBar
        exerciseId="a"
        exerciseOptions={exerciseOptions}
        restDurationMinutes={1}
        restDurationOptions={restOptions}
        isRunning
        isModelReady
        isCameraInitializing={false}
        resetStopEnabled
        onExerciseChange={vi.fn()}
        onStartPause={onStartPause}
        onReset={vi.fn()}
        onShutdown={vi.fn()}
        onRestDurationChange={vi.fn()}
      />,
    );
    await user.click(within(container).getByRole('button', { name: 'Пауза' }));
    expect(onStartPause).toHaveBeenCalledTimes(1);
  });

  test('calls onExerciseChange and onRestDurationChange from selects', async () => {
    const user = userEvent.setup();
    const onExerciseChange = vi.fn();
    const onRestDurationChange = vi.fn();
    const { container } = renderWithTheme(
      <ExerciseControlBar
        exerciseId="a"
        exerciseOptions={exerciseOptions}
        restDurationMinutes={1}
        restDurationOptions={restOptions}
        isRunning={false}
        isModelReady
        isCameraInitializing={false}
        resetStopEnabled
        onExerciseChange={onExerciseChange}
        onStartPause={vi.fn()}
        onReset={vi.fn()}
        onShutdown={vi.fn()}
        onRestDurationChange={onRestDurationChange}
      />,
    );
    const region = within(container);
    const comboboxes = region.getAllByRole('combobox');
    await user.selectOptions(comboboxes[0], 'b');
    await user.selectOptions(comboboxes[1], '2');
    expect(onExerciseChange).toHaveBeenCalledWith('b');
    expect(onRestDurationChange).toHaveBeenCalledWith(2);
  });

  test('matches snapshot (idle)', () => {
    const { container } = renderWithTheme(
      <ExerciseControlBar
        exerciseId="a"
        exerciseOptions={[{ value: 'a', label: 'A' }]}
        restDurationMinutes={1}
        restDurationOptions={[{ value: '1', label: '1m' }]}
        isRunning={false}
        isModelReady
        isCameraInitializing={false}
        resetStopEnabled
        onExerciseChange={vi.fn()}
        onStartPause={vi.fn()}
        onReset={vi.fn()}
        onShutdown={vi.fn()}
        onRestDurationChange={vi.fn()}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot (running)', () => {
    const { container } = renderWithTheme(
      <ExerciseControlBar
        exerciseId="a"
        exerciseOptions={[{ value: 'a', label: 'A' }]}
        restDurationMinutes={2}
        restDurationOptions={[{ value: '2', label: '2m' }]}
        isRunning
        isModelReady={false}
        isCameraInitializing
        resetStopEnabled={false}
        onExerciseChange={vi.fn()}
        onStartPause={vi.fn()}
        onReset={vi.fn()}
        onShutdown={vi.fn()}
        onRestDurationChange={vi.fn()}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

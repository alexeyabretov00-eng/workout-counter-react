import { describe, expect, test } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { ExerciseHistoryPageShell } from '../ExerciseHistoryPageShell';

describe('ExerciseHistoryPageShell', () => {
  test('matches snapshot', () => {
    const { container } = renderWithTheme(
      <ExerciseHistoryPageShell title="История упражнений">
        <div>child</div>
      </ExerciseHistoryPageShell>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

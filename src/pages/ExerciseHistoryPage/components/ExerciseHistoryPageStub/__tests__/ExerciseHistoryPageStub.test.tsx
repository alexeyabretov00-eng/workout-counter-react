import { describe, expect, test } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { ExerciseHistoryPageStub } from '../ExerciseHistoryPageStub';

describe('ExerciseHistoryPageStub', () => {
  test('matches snapshot', () => {
    const { container } = renderWithTheme(
      <ExerciseHistoryPageStub lead="Заглушка: раздел в разработке." />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

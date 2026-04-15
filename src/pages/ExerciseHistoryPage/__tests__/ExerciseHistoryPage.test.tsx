import { describe, expect, test } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { ExerciseHistoryPage } from '../ExerciseHistoryPage';

describe('ExerciseHistoryPage', () => {
  test('matches snapshot', () => {
    const { container } = renderWithTheme(<ExerciseHistoryPage />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

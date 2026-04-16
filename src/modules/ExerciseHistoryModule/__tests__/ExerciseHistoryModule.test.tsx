import { describe, expect, test } from 'vitest';

import { ExerciseHistoryModule } from '@modules/ExerciseHistoryModule';
import { renderWithTheme } from '@test-helpers';

describe('ExerciseHistoryModule', () => {
  test('matches snapshot', () => {
    const { container } = renderWithTheme(<ExerciseHistoryModule />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

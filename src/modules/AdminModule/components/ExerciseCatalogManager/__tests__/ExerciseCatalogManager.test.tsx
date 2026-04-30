import type { ExerciseDto } from '@api';
import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { ExerciseCatalogManager } from '../ExerciseCatalogManager';

const exercises: ExerciseDto[] = [
  {
    id: 1,
    slug: 'biceps-curl',
    name: 'Сгибание на бицепс',
    description: 'Подъем гантелей на бицепс.',
    detectorKey: 'biceps-curl',
    voiceAliases: ['бицепс'],
    sortOrder: 10,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    slug: 'squat',
    name: 'Присед',
    description: 'Классический присед.',
    detectorKey: 'squat',
    voiceAliases: ['присед'],
    sortOrder: 20,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

describe('ExerciseCatalogManager', () => {
  test('shows values of selected exercise in edit drawer', async () => {
    renderWithTheme(
      <ExerciseCatalogManager
        exercises={exercises}
        isLoading={false}
        isSubmitting={false}
        onCreate={vi.fn().mockResolvedValue(undefined)}
        onUpdate={vi.fn().mockResolvedValue(undefined)}
        onArchive={vi.fn().mockResolvedValue(undefined)}
      />,
    );

    const editButtons = screen.getAllByRole('button', { name: 'Редактировать' });
    fireEvent.click(editButtons[1]);

    const slugAndDetectorInputs = await screen.findAllByDisplayValue('squat');
    expect(slugAndDetectorInputs).toHaveLength(2);
    expect(screen.getByDisplayValue('Присед')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Сгибание на бицепс')).not.toBeInTheDocument();
  });
});

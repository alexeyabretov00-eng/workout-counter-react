import type { ExerciseDto } from '@api';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ExerciseCatalogManager } from '..';

const exercises: ExerciseDto[] = [
  {
    id: 1,
    slug: 'biceps-curl',
    name: 'Сгибание на бицепс',
    description: 'Подъем гантелей на бицепс стоя.',
    detectorKey: 'biceps-curl',
    voiceAliases: ['бицепс', 'сгибание'],
    sortOrder: 10,
    isActive: true,
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
  },
  {
    id: 2,
    slug: 'squat',
    name: 'Приседания',
    description: 'Классические приседания с собственным весом.',
    detectorKey: 'squat',
    voiceAliases: ['присед', 'приседания'],
    sortOrder: 20,
    isActive: false,
    createdAt: '2026-01-02T10:00:00.000Z',
    updatedAt: '2026-01-02T10:00:00.000Z',
  },
];

const meta = {
  title: 'Modules/AdminModule/ExerciseCatalogManager',
  component: ExerciseCatalogManager,
  tags: ['autodocs'],
  args: {
    exercises,
    isLoading: false,
    isSubmitting: false,
    onCreate: async () => {},
    onUpdate: async () => {},
    onArchive: async () => {},
  },
} satisfies Meta<typeof ExerciseCatalogManager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};

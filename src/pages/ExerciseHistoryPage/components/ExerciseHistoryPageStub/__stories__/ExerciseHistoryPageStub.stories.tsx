import type { Meta, StoryObj } from '@storybook/react-vite';

import { ExerciseHistoryPageStub } from '..';

const meta = {
  title: 'Pages/ExerciseHistoryPage/ExerciseHistoryPageStub',
  component: ExerciseHistoryPageStub,
  tags: ['autodocs'],
  args: {
    lead: 'Раздел в разработке: после входа здесь появится история тренировок.',
  },
} satisfies Meta<typeof ExerciseHistoryPageStub>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

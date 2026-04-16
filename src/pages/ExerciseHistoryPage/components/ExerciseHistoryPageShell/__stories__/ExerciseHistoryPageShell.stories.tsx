import type { Meta, StoryObj } from '@storybook/react-vite';

import { ExerciseHistoryPageShell } from '..';

const meta = {
  title: 'Pages/ExerciseHistoryPage/ExerciseHistoryPageShell',
  component: ExerciseHistoryPageShell,
  tags: ['autodocs'],
  args: {
    title: 'История упражнений',
    children: <p>Здесь будет журнал подходов и сессий.</p>,
  },
} satisfies Meta<typeof ExerciseHistoryPageShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

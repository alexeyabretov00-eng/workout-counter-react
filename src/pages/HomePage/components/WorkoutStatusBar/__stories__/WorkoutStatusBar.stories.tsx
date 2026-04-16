import type { Meta, StoryObj } from '@storybook/react-vite';

import { WorkoutStatusBar } from '..';

const meta = {
  title: 'Pages/HomePage/WorkoutStatusBar',
  component: WorkoutStatusBar,
  tags: ['autodocs'],
  args: {
    modelStatus: 'ready',
    modelStatusLabel: 'готово',
    isCameraReady: true,
    voiceStatus: 'listening',
    voiceStatusLabel: 'Голос: слушаю',
    isPaused: false,
    cameraError: null,
  },
} satisfies Meta<typeof WorkoutStatusBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FullAlerts: Story = {
  args: {
    modelStatus: 'error',
    modelStatusLabel: 'ошибка',
    isCameraReady: false,
    voiceStatus: 'error',
    voiceStatusLabel: 'Голос: ошибка',
    isPaused: true,
    cameraError: 'Не удалось открыть камеру',
  },
};

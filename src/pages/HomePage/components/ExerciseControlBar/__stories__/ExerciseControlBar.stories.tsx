import type { Meta, StoryObj } from '@storybook/react-vite';

import { ExerciseControlBar } from '..';

const exerciseOptions = [
  { value: 'squat', label: 'Приседания' },
  { value: 'curl', label: 'Подъём на бицепс' },
];

const restDurationOptions = [
  { value: '1', label: '1 мин' },
  { value: '2', label: '2 мин' },
  { value: '3', label: '3 мин' },
];

const noopHandlers = {
  onExerciseChange: () => {},
  onStartPause: () => {},
  onReset: () => {},
  onShutdown: () => {},
  onRestDurationChange: () => {},
};

const meta = {
  title: 'Pages/HomePage/ExerciseControlBar',
  component: ExerciseControlBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    exerciseId: 'squat',
    exerciseOptions,
    restDurationMinutes: 3,
    restDurationOptions,
    isRunning: false,
    isModelReady: true,
    isCameraInitializing: false,
    resetStopEnabled: true,
    ...noopHandlers,
  },
} satisfies Meta<typeof ExerciseControlBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IdleReady: Story = {};

export const Running: Story = {
  args: {
    isRunning: true,
    resetStopEnabled: true,
  },
};

export const StartDisabledWaitingModel: Story = {
  args: {
    isModelReady: false,
    isCameraInitializing: false,
    resetStopEnabled: false,
  },
};

export const CameraInitializing: Story = {
  args: {
    isCameraInitializing: true,
    isModelReady: true,
    resetStopEnabled: false,
  },
};

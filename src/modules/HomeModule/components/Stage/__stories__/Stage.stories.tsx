import { createRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Stage } from '..';

const meta = {
  title: 'Modules/HomeModule/Stage',
  component: Stage,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Stage>;

export default meta;
type Story = StoryObj<typeof meta>;

const dummyCanvasArgs = {
  canvasRef: { current: null },
  isCameraInitializing: false,
  isPaused: false,
} as const;

export const Canvas: Story = {
  args: dummyCanvasArgs,
  render: () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    return <Stage canvasRef={canvasRef} isCameraInitializing={false} isPaused={false} />;
  },
};

export const CameraLoading: Story = {
  args: dummyCanvasArgs,
  render: () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    return <Stage canvasRef={canvasRef} isCameraInitializing isPaused={false} />;
  },
};

export const Paused: Story = {
  args: dummyCanvasArgs,
  render: () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    return <Stage canvasRef={canvasRef} isCameraInitializing={false} isPaused />;
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';

import { HomeLayout } from '..';

const meta = {
  title: 'Pages/HomePage/HomeLayout',
  component: HomeLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    header: <div>Шапка и навигация</div>,
    controls: <div>Панель управления (слот)</div>,
    statusBar: <div>Строка состояния</div>,
    stage: <div>Сцена / canvas</div>,
  },
} satisfies Meta<typeof HomeLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

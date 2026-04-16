import type { Meta, StoryObj } from '@storybook/react-vite';

import { AdminPageShell } from '..';

const meta = {
  title: 'Modules/AdminModule/AdminPageShell',
  component: AdminPageShell,
  tags: ['autodocs'],
  args: {
    title: 'Администрирование',
    children: <p>Содержимое раздела</p>,
  },
} satisfies Meta<typeof AdminPageShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

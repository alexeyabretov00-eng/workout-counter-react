import type { Meta, StoryObj } from '@storybook/react-vite';

import { AdminPageStub } from '..';

const meta = {
  title: 'Modules/AdminModule/AdminPageStub',
  component: AdminPageStub,
  tags: ['autodocs'],
  args: {
    lead: 'Панель администратора появится в следующих версиях.',
  },
} satisfies Meta<typeof AdminPageStub>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

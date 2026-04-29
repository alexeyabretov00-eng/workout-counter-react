import type { Meta, StoryObj } from '@storybook/react-vite';

import { UserManagementLayout } from '..';

const meta = {
  title: 'Modules/UserManagementModule/UserManagementLayout',
  component: UserManagementLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof UserManagementLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <UserManagementLayout>
      <div>Таблица пользователей</div>
    </UserManagementLayout>
  ),
};

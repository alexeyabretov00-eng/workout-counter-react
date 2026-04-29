import type { Meta, StoryObj } from '@storybook/react-vite';

import { UserManagementTable } from '..';

const usersFixture = [
  {
    id: 1,
    login: 'root',
    role: 'superadmin',
    mustChangePassword: false,
    createdAt: '2026-01-01',
  },
  {
    id: 2,
    login: 'manager',
    role: 'admin',
    mustChangePassword: true,
    createdAt: '2026-01-12',
  },
  {
    id: 3,
    login: 'user1',
    role: 'user',
    mustChangePassword: false,
    createdAt: '2026-02-02',
  },
] as const;

const meta = {
  title: 'Modules/UserManagementModule/UserManagementTable',
  component: UserManagementTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    users: [...usersFixture],
    isLoading: false,
    currentUserId: 1,
    isUpdatingByUserId: {},
    onRoleChange: () => {},
  },
} satisfies Meta<typeof UserManagementTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const UpdatingRow: Story = {
  args: {
    isUpdatingByUserId: { 2: true },
  },
};

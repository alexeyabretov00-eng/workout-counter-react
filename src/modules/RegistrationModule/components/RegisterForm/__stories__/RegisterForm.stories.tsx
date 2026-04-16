import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { RegisterForm } from '..';

const meta = {
  title: 'Modules/RegistrationModule/RegisterForm',
  component: RegisterForm,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    login: 'newuser',
    password: 'secret',
    error: null,
    pending: false,
    onLoginChange: () => {},
    onPasswordChange: () => {},
    onSubmit: async () => {},
  },
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: 'Логин уже занят',
  },
};

export const Pending: Story = {
  args: {
    pending: true,
  },
};

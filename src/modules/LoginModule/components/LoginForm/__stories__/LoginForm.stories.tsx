import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { LoginForm } from '..';

const meta = {
  title: 'Modules/LoginModule/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    login: 'user',
    password: 'secret',
    error: null,
    pending: false,
    onLoginChange: () => {},
    onPasswordChange: () => {},
    onSubmit: async () => {},
    onGoToRegister: () => {},
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: 'Неверный логин или пароль',
  },
};

export const Pending: Story = {
  args: {
    pending: true,
  },
};

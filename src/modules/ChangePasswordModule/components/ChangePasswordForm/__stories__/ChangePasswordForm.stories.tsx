import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChangePasswordForm } from '..';

const meta = {
  title: 'Modules/ChangePasswordModule/ChangePasswordForm',
  component: ChangePasswordForm,
  tags: ['autodocs'],
  args: {
    password: 'secret42',
    pending: false,
    isSubmitDisabled: false,
    error: null,
    onPasswordChange: () => {},
    onSubmit: async () => {},
  },
} satisfies Meta<typeof ChangePasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pending: Story = {
  args: {
    pending: true,
    isSubmitDisabled: true,
  },
};

export const SubmitDisabled: Story = {
  args: {
    password: 'short',
    isSubmitDisabled: true,
  },
};

export const WithError: Story = {
  args: {
    error: 'Не удалось сменить пароль.',
  },
};

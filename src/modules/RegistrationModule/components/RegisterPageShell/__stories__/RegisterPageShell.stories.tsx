import type { Meta, StoryObj } from '@storybook/react-vite';

import { RegisterPageShell } from '..';

const meta = {
  title: 'Modules/RegistrationModule/RegisterPageShell',
  component: RegisterPageShell,
  tags: ['autodocs'],
  args: {
    title: 'Регистрация',
    children: <p>Поля логина и пароля</p>,
  },
} satisfies Meta<typeof RegisterPageShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from '@storybook/react-vite';

import { LoginPageShell } from '..';

const meta = {
  title: 'Modules/LoginModule/LoginPageShell',
  component: LoginPageShell,
  tags: ['autodocs'],
  args: {
    title: 'Вход',
    children: <p>Форма входа и подсказки</p>,
  },
} satisfies Meta<typeof LoginPageShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

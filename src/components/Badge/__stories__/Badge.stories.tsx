import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge, type BadgeVariant } from '..';

const variants: BadgeVariant[] = [
  'neutral',
  'success',
  'info',
  'error',
  'warning',
  'muted',
  'note',
];

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
    },
  },
  args: {
    children: 'Статус',
    variant: 'neutral' satisfies BadgeVariant,
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Success: Story = {
  args: { variant: 'success', children: 'Готово' },
};

export const Error: Story = {
  args: { variant: 'error', children: 'Ошибка' },
};

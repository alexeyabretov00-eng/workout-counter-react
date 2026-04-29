import type { Meta, StoryObj } from '@storybook/react-vite';

import { ModuleScaffold } from '..';

const meta = {
  title: 'Components/ModuleScaffold',
  component: ModuleScaffold,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: 'Заголовок модуля',
  },
} satisfies Meta<typeof ModuleScaffold>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <ModuleScaffold {...args}>
      <p>Контент страницы модуля.</p>
    </ModuleScaffold>
  ),
};

export const WithLongContent: Story = {
  render: args => (
    <ModuleScaffold {...args}>
      <p>Первый блок контента.</p>
      <p>Второй блок контента с дополнительным описанием.</p>
      <p>Третий блок контента для проверки вертикального ритма.</p>
    </ModuleScaffold>
  ),
};

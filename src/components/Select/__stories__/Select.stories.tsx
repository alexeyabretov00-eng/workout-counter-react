import { type ComponentProps, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Select, type SelectOption } from '..';

const options: SelectOption[] = [
  { value: 'squat', label: 'Приседания' },
  { value: 'curl', label: 'Сгибание на бицепс' },
  { value: 'press', label: 'Жим' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const SelectStateful = (props: { disabled?: boolean }) => {
  const [value, setValue] = useState(options[0]?.value ?? '');
  return (
    <div style={{ minWidth: 280 }}>
      <Select
        id="storybook-select"
        label="Упражнение"
        value={value}
        options={options}
        onChange={setValue}
        disabled={props.disabled}
      />
    </div>
  );
};

const selectArgs = {
  id: 'storybook-select',
  label: 'Упражнение',
  value: options[0]?.value ?? '',
  options,
  onChange: () => {},
} satisfies Pick<ComponentProps<typeof Select>, 'id' | 'label' | 'value' | 'options' | 'onChange'>;

export const Default: Story = {
  args: selectArgs,
  render: () => <SelectStateful />,
};

export const Disabled: Story = {
  args: { ...selectArgs, disabled: true },
  render: () => <SelectStateful disabled />,
};

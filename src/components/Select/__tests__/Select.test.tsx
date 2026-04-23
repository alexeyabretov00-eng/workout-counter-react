import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { Select } from '@components';
import { renderWithTheme } from '@test-helpers';

const defaultOptions = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
];

describe('Select', () => {
  test('calls onChange with selected value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithTheme(
      <Select
        id="sel-events"
        label="Pick"
        value="a"
        options={defaultOptions}
        onChange={onChange}
      />,
    );
    const combo = screen.getByRole('combobox', { name: 'Pick' });
    await user.click(combo);
    await user.click(await screen.findByText('B'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  test('is disabled and does not accept changes', () => {
    const onChange = vi.fn();
    renderWithTheme(
      <Select
        id="sel-disabled"
        label="Disabled field"
        value="a"
        options={defaultOptions}
        onChange={onChange}
        disabled
      />,
    );
    const combo = screen.getByRole('combobox', { name: 'Disabled field' });
    expect(combo).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('matches snapshot', () => {
    const { container } = renderWithTheme(
      <Select id="sel" label="Pick" value="a" options={defaultOptions} onChange={vi.fn()} />,
    );
    expect(container).toMatchSnapshot();
  });
});

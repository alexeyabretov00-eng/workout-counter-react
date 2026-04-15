import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

import { Button } from '@components';
import { renderWithTheme } from '@test-helpers';

describe('Button', () => {
  test('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithTheme(<Button onClick={onClick}>Submit</Button>);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithTheme(
      <Button onClick={onClick} disabled>
        Blocked
      </Button>,
    );
    await user.click(screen.getByRole('button', { name: 'Blocked' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('matches snapshot', () => {
    const { container } = renderWithTheme(<Button onClick={vi.fn()}>Click</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot disabled', () => {
    const { container } = renderWithTheme(
      <Button onClick={vi.fn()} disabled ariaLabel="x">
        Click
      </Button>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

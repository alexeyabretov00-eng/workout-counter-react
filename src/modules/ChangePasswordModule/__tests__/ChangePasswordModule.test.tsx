import { screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { renderWithTheme } from '@test-helpers';

vi.mock('../containers', () => ({
  ChangePasswordFormContainer: () => <div data-testid="change-password-form-container" />,
}));

import { ChangePasswordModule } from '../ChangePasswordModule';

describe('ChangePasswordModule', () => {
  test('renders scaffold title and form container', () => {
    renderWithTheme(<ChangePasswordModule />);

    expect(screen.getByText('Смена пароля')).toBeInTheDocument();
    expect(screen.getByTestId('change-password-form-container')).toBeInTheDocument();
  });
});

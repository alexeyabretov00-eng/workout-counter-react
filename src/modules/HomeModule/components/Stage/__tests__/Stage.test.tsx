import { createRef } from 'react';
import { describe, expect, test } from 'vitest';

import { renderWithTheme } from '@test-helpers';

import { Stage } from '../Stage';

describe('Stage', () => {
  test('matches snapshot (camera loading)', () => {
    const ref = createRef<HTMLCanvasElement>();
    const { container } = renderWithTheme(
      <Stage canvasRef={ref} isCameraInitializing isPaused={false} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot (paused)', () => {
    const ref = createRef<HTMLCanvasElement>();
    const { container } = renderWithTheme(
      <Stage canvasRef={ref} isCameraInitializing={false} isPaused />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('matches snapshot (live canvas)', () => {
    const ref = createRef<HTMLCanvasElement>();
    const { container } = renderWithTheme(
      <Stage canvasRef={ref} isCameraInitializing={false} isPaused={false} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { clearCanvas, computeCoverLayout, drawRestCountdown, resizeCanvas } from '../canvas';

describe('canvas helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('devicePixelRatio', 2);
  });

  test('computeCoverLayout scales cover', () => {
    expect(computeCoverLayout(16, 9, 800, 450)).toEqual({
      dx: 0,
      dy: 0,
      dw: 800,
      dh: 450,
    });
  });

  test('clearCanvas no-ops on null', () => {
    expect(() => clearCanvas(null)).not.toThrow();
  });

  test('clearCanvas resizes and clears when dimensions change', () => {
    const clearRect = vi.fn();
    const canvas = {
      clientWidth: 100,
      clientHeight: 50,
      width: 0,
      height: 0,
      getContext: () => ({
        clearRect,
      }),
    } as unknown as HTMLCanvasElement;
    clearCanvas(canvas);
    expect(canvas.width).toBe(200);
    expect(canvas.height).toBe(100);
    expect(clearRect).toHaveBeenCalled();
  });

  test('clearCanvas returns when getContext is null', () => {
    const canvas = {
      clientWidth: 100,
      clientHeight: 50,
      getContext: () => null,
    } as unknown as HTMLCanvasElement;
    expect(() => clearCanvas(canvas)).not.toThrow();
  });

  test('resizeCanvas updates bitmap size from css size and dpr', () => {
    const canvas = {
      clientWidth: 120,
      clientHeight: 40,
      width: 1,
      height: 1,
    } as unknown as HTMLCanvasElement;
    resizeCanvas(canvas);
    expect(canvas.width).toBe(240);
    expect(canvas.height).toBe(80);
  });

  test('drawRestCountdown draws ring and labels', () => {
    const clearRect = vi.fn();
    const arc = vi.fn();
    const stroke = vi.fn();
    const beginPath = vi.fn();
    const moveTo = vi.fn();
    const lineTo = vi.fn();
    const fillText = vi.fn();
    const save = vi.fn();
    const restore = vi.fn();
    const canvas = {
      clientWidth: 200,
      clientHeight: 200,
      width: 200,
      height: 200,
      getContext: () =>
        ({
          clearRect,
          strokeStyle: '',
          lineWidth: 0,
          lineCap: '',
          fillStyle: '',
          textAlign: '',
          textBaseline: '',
          font: '',
          beginPath,
          arc,
          stroke,
          moveTo,
          lineTo,
          fillText,
          save,
          restore,
        }) as unknown as CanvasRenderingContext2D,
    } as unknown as HTMLCanvasElement;

    drawRestCountdown(canvas, 90_000, 120_000);
    expect(clearRect).toHaveBeenCalled();
    expect(arc).toHaveBeenCalled();
    expect(fillText.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});

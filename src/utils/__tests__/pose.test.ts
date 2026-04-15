import type { ExerciseRuntimeState } from '@types';
import { describe, expect, test, vi } from 'vitest';

import {
  calculateAngle,
  drawFrame,
  getPoint,
  POSE_INDEX,
  type PoseLandmarks,
  type PosePoint,
} from '../pose';

const point = (x: number, y: number, visibility = 1, presence = 1): PosePoint => ({
  x,
  y,
  z: 0,
  visibility,
  presence,
});

describe('pose helpers', () => {
  test('POSE_INDEX exposes key joints', () => {
    expect(POSE_INDEX.nose).toBe(0);
    expect(POSE_INDEX.leftShoulder).toBe(11);
  });

  test('getPoint returns null for missing or low visibility', () => {
    expect(getPoint(null, 0, 0.5)).toBe(null);
    const landmarks: PoseLandmarks = [];
    expect(getPoint(landmarks, 0, 0.5)).toBe(null);
    const low = [point(0, 0, 0.1, 1)];
    expect(getPoint(low, 0, 0.5)).toBe(null);
  });

  test('getPoint returns point when visible', () => {
    const landmarks: PoseLandmarks = [point(0.1, 0.2)];
    expect(getPoint(landmarks, 0, 0.5)).toEqual(point(0.1, 0.2));
  });

  test('calculateAngle returns 180 for degenerate segments', () => {
    const a = point(0, 0);
    const b = point(0, 0);
    const c = point(1, 0);
    expect(calculateAngle(a, b, c)).toBe(180);
  });

  test('calculateAngle measures non-degenerate angle', () => {
    expect(calculateAngle(point(0, 1), point(0, 0), point(1, 0))).toBeCloseTo(90, 5);
  });

  test('drawFrame returns early without context or video metrics', () => {
    const canvas = {
      getContext: () => null,
    } as unknown as HTMLCanvasElement;
    const video = { videoWidth: 0, videoHeight: 0 } as HTMLVideoElement;
    const runtime = {
      reps: 0,
      phase: 'idle',
      confidence: 0,
      metrics: {},
      isBodyDetected: false,
    } as ExerciseRuntimeState;
    expect(() => drawFrame(canvas, video, null, runtime)).not.toThrow();
  });

  test('drawFrame draws video, skeleton, and hud', () => {
    const clearRect = vi.fn();
    const drawImage = vi.fn();
    const fillRect = vi.fn();
    const fillText = vi.fn();
    const stroke = vi.fn();
    const beginPath = vi.fn();
    const moveTo = vi.fn();
    const lineTo = vi.fn();
    const arc = vi.fn();
    const ctx = {
      clearRect,
      drawImage,
      fillRect,
      fillText,
      stroke,
      beginPath,
      moveTo,
      lineTo,
      arc,
      fill: vi.fn(),
      lineWidth: 0,
      strokeStyle: '',
      fillStyle: '',
      font: '',
      save: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    const canvas = {
      width: 400,
      height: 300,
      clientWidth: 400,
      clientHeight: 300,
      getContext: () => ctx,
    } as unknown as HTMLCanvasElement;

    const video = { videoWidth: 640, videoHeight: 360 } as HTMLVideoElement;

    const landmarks: PoseLandmarks = Array.from({ length: 33 }, () => point(0.5, 0.5));
    landmarks[11] = point(0.4, 0.4);
    landmarks[12] = point(0.6, 0.4);

    const runtime: ExerciseRuntimeState = {
      reps: 2,
      phase: 'down',
      confidence: 0.8,
      metrics: { angle: 12.3 },
      isBodyDetected: true,
    };

    drawFrame(canvas, video, landmarks, runtime);
    expect(drawImage).toHaveBeenCalled();
    expect(stroke).toHaveBeenCalled();
    expect(fillText).toHaveBeenCalled();
  });
});

import type { PoseLandmarks } from '@utils';
import { describe, expect, test } from 'vitest';

import {
  armyPressDetector,
  bicepsCurlDetector,
  exerciseRegistry,
  headSideTiltDetector,
  squatDetector,
} from '..';

const createEmptyLandmarks = (): PoseLandmarks => {
  return Array.from({ length: 33 }, () => ({
    x: 0,
    y: 0,
    z: 0,
    visibility: 1,
    presence: 1,
  }));
};

describe('exercise detectors', () => {
  test('builds registry from active detectors', () => {
    expect(exerciseRegistry.length).toBeGreaterThan(0);
    expect(exerciseRegistry.some(detector => detector.id === bicepsCurlDetector.id)).toBe(true);
    expect(exerciseRegistry.some(detector => detector.id === squatDetector.id)).toBe(true);
    expect(exerciseRegistry.some(detector => detector.id === armyPressDetector.id)).toBe(true);
    expect(exerciseRegistry.some(detector => detector.id === headSideTiltDetector.id)).toBe(true);
    expect(exerciseRegistry.every(detector => Boolean(detector.isActive))).toBe(true);
  });

  test('counts one biceps curl rep after down-up-down', () => {
    const down = createEmptyLandmarks();
    down[11] = { x: 0.4, y: 0.3, z: 0, visibility: 1, presence: 1 };
    down[13] = { x: 0.4, y: 0.45, z: 0, visibility: 1, presence: 1 };
    down[15] = { x: 0.4, y: 0.6, z: 0, visibility: 1, presence: 1 };
    down[12] = { x: 0.6, y: 0.3, z: 0, visibility: 1, presence: 1 };
    down[14] = { x: 0.6, y: 0.45, z: 0, visibility: 1, presence: 1 };
    down[16] = { x: 0.6, y: 0.6, z: 0, visibility: 1, presence: 1 };

    const up = createEmptyLandmarks();
    up[11] = { x: 0.4, y: 0.3, z: 0, visibility: 1, presence: 1 };
    up[13] = { x: 0.4, y: 0.45, z: 0, visibility: 1, presence: 1 };
    up[15] = { x: 0.52, y: 0.36, z: 0, visibility: 1, presence: 1 };
    up[12] = { x: 0.6, y: 0.3, z: 0, visibility: 1, presence: 1 };
    up[14] = { x: 0.6, y: 0.45, z: 0, visibility: 1, presence: 1 };
    up[16] = { x: 0.72, y: 0.36, z: 0, visibility: 1, presence: 1 };

    let state = bicepsCurlDetector.createState();
    state = bicepsCurlDetector.update(down, state).nextState;
    state = bicepsCurlDetector.update(up, state).nextState;
    const result = bicepsCurlDetector.update(down, state);

    expect(result.repDelta).toBe(1);
  });

  test('counts one squat rep after standing-squat-standing', () => {
    const standing = createEmptyLandmarks();
    standing[23] = { x: 0.45, y: 0.4, z: 0, visibility: 1, presence: 1 };
    standing[25] = { x: 0.45, y: 0.6, z: 0, visibility: 1, presence: 1 };
    standing[27] = { x: 0.45, y: 0.8, z: 0, visibility: 1, presence: 1 };
    standing[24] = { x: 0.55, y: 0.4, z: 0, visibility: 1, presence: 1 };
    standing[26] = { x: 0.55, y: 0.6, z: 0, visibility: 1, presence: 1 };
    standing[28] = { x: 0.55, y: 0.8, z: 0, visibility: 1, presence: 1 };

    const squat = createEmptyLandmarks();
    squat[23] = { x: 0.45, y: 0.4, z: 0, visibility: 1, presence: 1 };
    squat[25] = { x: 0.45, y: 0.6, z: 0, visibility: 1, presence: 1 };
    squat[27] = { x: 0.62, y: 0.5, z: 0, visibility: 1, presence: 1 };
    squat[24] = { x: 0.55, y: 0.4, z: 0, visibility: 1, presence: 1 };
    squat[26] = { x: 0.55, y: 0.6, z: 0, visibility: 1, presence: 1 };
    squat[28] = { x: 0.38, y: 0.5, z: 0, visibility: 1, presence: 1 };

    let state = squatDetector.createState();
    state = squatDetector.update(standing, state).nextState;
    state = squatDetector.update(squat, state).nextState;
    const result = squatDetector.update(standing, state);

    expect(result.repDelta).toBe(1);
  });

  test('counts one army press rep after down-up-down', () => {
    const down = createEmptyLandmarks();
    down[11] = { x: 0.4, y: 0.3, z: 0, visibility: 1, presence: 1 };
    down[13] = { x: 0.4, y: 0.45, z: 0, visibility: 1, presence: 1 };
    down[15] = { x: 0.52, y: 0.36, z: 0, visibility: 1, presence: 1 };
    down[12] = { x: 0.6, y: 0.3, z: 0, visibility: 1, presence: 1 };
    down[14] = { x: 0.6, y: 0.45, z: 0, visibility: 1, presence: 1 };
    down[16] = { x: 0.72, y: 0.36, z: 0, visibility: 1, presence: 1 };

    const up = createEmptyLandmarks();
    up[11] = { x: 0.4, y: 0.3, z: 0, visibility: 1, presence: 1 };
    up[13] = { x: 0.4, y: 0.15, z: 0, visibility: 1, presence: 1 };
    up[15] = { x: 0.4, y: 0.03, z: 0, visibility: 1, presence: 1 };
    up[12] = { x: 0.6, y: 0.3, z: 0, visibility: 1, presence: 1 };
    up[14] = { x: 0.6, y: 0.15, z: 0, visibility: 1, presence: 1 };
    up[16] = { x: 0.6, y: 0.03, z: 0, visibility: 1, presence: 1 };

    let state = armyPressDetector.createState();
    state = armyPressDetector.update(down, state).nextState;
    state = armyPressDetector.update(up, state).nextState;
    const result = armyPressDetector.update(down, state);

    expect(result.repDelta).toBe(1);
  });

  test('does not treat horizontal arms as army press top phase', () => {
    const down = createEmptyLandmarks();
    down[11] = { x: 0.4, y: 0.3, z: 0, visibility: 1, presence: 1 };
    down[13] = { x: 0.4, y: 0.45, z: 0, visibility: 1, presence: 1 };
    down[15] = { x: 0.52, y: 0.36, z: 0, visibility: 1, presence: 1 };
    down[12] = { x: 0.6, y: 0.3, z: 0, visibility: 1, presence: 1 };
    down[14] = { x: 0.6, y: 0.45, z: 0, visibility: 1, presence: 1 };
    down[16] = { x: 0.72, y: 0.36, z: 0, visibility: 1, presence: 1 };

    const horizontal = createEmptyLandmarks();
    horizontal[11] = { x: 0.4, y: 0.3, z: 0, visibility: 1, presence: 1 };
    horizontal[13] = { x: 0.4, y: 0.3, z: 0, visibility: 1, presence: 1 };
    horizontal[15] = { x: 0.4, y: 0.3, z: 0, visibility: 1, presence: 1 };
    horizontal[12] = { x: 0.6, y: 0.3, z: 0, visibility: 1, presence: 1 };
    horizontal[14] = { x: 0.6, y: 0.3, z: 0, visibility: 1, presence: 1 };
    horizontal[16] = { x: 0.6, y: 0.3, z: 0, visibility: 1, presence: 1 };

    let state = armyPressDetector.createState();
    state = armyPressDetector.update(down, state).nextState;
    state = armyPressDetector.update(horizontal, state).nextState;
    const result = armyPressDetector.update(down, state);

    expect(result.repDelta).toBe(0);
  });

  test('counts one head side tilt rep after right-left sequence', () => {
    const center = createEmptyLandmarks();
    center[0] = { x: 0.5, y: 0.2, z: 0, visibility: 1, presence: 1 };
    center[11] = { x: 0.45, y: 0.4, z: 0, visibility: 1, presence: 1 };
    center[12] = { x: 0.55, y: 0.4, z: 0, visibility: 1, presence: 1 };

    const right = createEmptyLandmarks();
    right[0] = { x: 0.56, y: 0.2, z: 0, visibility: 1, presence: 1 };
    right[11] = { x: 0.45, y: 0.4, z: 0, visibility: 1, presence: 1 };
    right[12] = { x: 0.55, y: 0.4, z: 0, visibility: 1, presence: 1 };

    const left = createEmptyLandmarks();
    left[0] = { x: 0.44, y: 0.2, z: 0, visibility: 1, presence: 1 };
    left[11] = { x: 0.45, y: 0.4, z: 0, visibility: 1, presence: 1 };
    left[12] = { x: 0.55, y: 0.4, z: 0, visibility: 1, presence: 1 };

    let state = headSideTiltDetector.createState();
    state = headSideTiltDetector.update(center, state).nextState;
    state = headSideTiltDetector.update(right, state).nextState;
    const result = headSideTiltDetector.update(left, state);

    expect(result.repDelta).toBe(1);
  });
});

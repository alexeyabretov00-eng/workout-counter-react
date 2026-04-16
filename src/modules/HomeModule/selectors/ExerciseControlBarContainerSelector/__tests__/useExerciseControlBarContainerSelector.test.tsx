import type { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import type { WorkoutSessionChromeControlsValue } from '../../../contexts';
import { WorkoutSessionChromeControlsContext } from '../../../contexts';
import { useExerciseControlBarContainerSelector } from '../useExerciseControlBarContainerSelector';

const dispatchChromeControl = vi.fn();

const wrapperValue: WorkoutSessionChromeControlsValue = {
  exerciseId: 'biceps_curl',
  restDurationMinutes: 2,
  isRunning: false,
  resetStopEnabled: true,
  isModelReady: true,
  isCameraInitializing: false,
  dispatchChromeControl,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <WorkoutSessionChromeControlsContext.Provider value={wrapperValue}>
    {children}
  </WorkoutSessionChromeControlsContext.Provider>
);

describe('useExerciseControlBarContainerSelector', () => {
  test('maps controls context', () => {
    const { result } = renderHook(() => useExerciseControlBarContainerSelector(), { wrapper });
    expect(result.current.exerciseId).toBe('biceps_curl');
    expect(result.current.restDurationOptions.length).toBe(4);
    expect(result.current.dispatchChromeControl).toBe(dispatchChromeControl);
  });
});

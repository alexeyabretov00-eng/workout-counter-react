import type { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import type { WorkoutSessionStageValue } from '../../../contexts';
import { WorkoutSessionStageContext } from '../../../contexts';
import { useStageContainerSelector } from '../useStageContainerSelector';

const canvasRef = { current: null };

const wrapperValue: WorkoutSessionStageValue = {
  canvasRef,
  isCameraInitializing: true,
  isPaused: false,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <WorkoutSessionStageContext.Provider value={wrapperValue}>
    {children}
  </WorkoutSessionStageContext.Provider>
);

describe('useStageContainerSelector', () => {
  test('maps stage context', () => {
    const { result } = renderHook(() => useStageContainerSelector(), { wrapper });
    expect(result.current.canvasRef).toBe(canvasRef);
    expect(result.current.isCameraInitializing).toBe(true);
    expect(result.current.isPaused).toBe(false);
  });
});

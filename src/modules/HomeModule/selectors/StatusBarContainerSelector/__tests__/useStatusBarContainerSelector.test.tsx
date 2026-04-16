import type { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import {
  WorkoutSessionChromeStatusContext,
  type WorkoutSessionChromeStatusValue,
} from '../../../contexts';
import { useStatusBarContainerSelector } from '../useStatusBarContainerSelector';

const wrapperValue: WorkoutSessionChromeStatusValue = {
  modelStatus: 'ready',
  isCameraReady: true,
  voiceStatus: 'listening',
  isPaused: false,
  cameraError: null,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <WorkoutSessionChromeStatusContext.Provider value={wrapperValue}>
    {children}
  </WorkoutSessionChromeStatusContext.Provider>
);

describe('useStatusBarContainerSelector', () => {
  test('maps status context to bar props', () => {
    const { result } = renderHook(() => useStatusBarContainerSelector(), { wrapper });
    expect(result.current.modelStatusLabel).toBe('загружена');
    expect(result.current.voiceStatusLabel).toContain('слушаю');
    expect(result.current.isCameraReady).toBe(true);
  });
});

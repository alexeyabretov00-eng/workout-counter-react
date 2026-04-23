import { useMemo } from 'react';

import { useWorkoutSessionStageContext } from '../contexts';

/**
 * Срез {@link WorkoutSessionStageContext} для слота сцены (без кадра камеры).
 */
export const useStageContainerSelector = () => {
  const ctx = useWorkoutSessionStageContext();
  return useMemo(
    () => ({
      canvasRef: ctx.canvasRef,
      isCameraInitializing: ctx.isCameraInitializing,
      isPaused: ctx.isPaused,
    }),
    [ctx.canvasRef, ctx.isCameraInitializing, ctx.isPaused],
  );
};

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
    }),
    [ctx.canvasRef],
  );
};

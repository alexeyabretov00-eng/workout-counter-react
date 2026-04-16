import { useMemo } from 'react';

import { useWorkoutSessionStageContext } from '../../contexts';

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

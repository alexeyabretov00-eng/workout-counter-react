import type { RefObject } from 'react';

/**
 * Срез для слота сцены: ref на canvas.
 * Поля, обновляемые на каждом кадре камеры, здесь не появляются — кадр рисуется
 * императивно в `useWorkoutSession` (`requestAnimationFrame` + `drawFrame`), без React state.
 */
export type WorkoutSessionStageValue = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

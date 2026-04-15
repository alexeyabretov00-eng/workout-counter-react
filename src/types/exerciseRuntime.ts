/** Снимок состояния детектора и счётчика для HUD и отрисовки (общий для `utils/pose` и экрана тренировки). */
export type ExerciseRuntimeState = {
  reps: number
  phase: string
  confidence: number
  metrics: Record<string, number>
  isBodyDetected: boolean
}

export type WorkoutSessionChromeControlsValue = {
  exerciseId: string
  setExerciseId: (id: string) => void
  restDurationMinutes: number
  setRestDurationMinutes: (minutes: number) => void
  isRunning: boolean
  resetStopEnabled: boolean
  isModelReady: boolean
  isCameraInitializing: boolean
  start: () => Promise<void>
  pause: () => void
  reset: () => void
  shutdown: (restDurationOverrideMs?: number) => void
}

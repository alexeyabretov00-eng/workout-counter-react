export type WorkoutSessionChromeControlAction =
  | { type: 'start' }
  | { type: 'pause' }
  | { type: 'reset' }
  | { type: 'shutdown'; restDurationOverrideMs?: number }

export type WorkoutSessionChromeControlsValue = {
  exerciseId: string
  setExerciseId: (id: string) => void
  restDurationMinutes: number
  setRestDurationMinutes: (minutes: number) => void
  isRunning: boolean
  resetStopEnabled: boolean
  isModelReady: boolean
  isCameraInitializing: boolean
  dispatchChromeControl: (action: WorkoutSessionChromeControlAction) => void
}

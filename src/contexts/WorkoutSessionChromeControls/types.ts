export type WorkoutSessionChromeControlAction =
  | { type: 'start' }
  | { type: 'pause' }
  | { type: 'reset' }
  | { type: 'shutdown'; restDurationOverrideMs?: number }
  | { type: 'setExerciseId'; exerciseId: string }
  | { type: 'setRestDurationMinutes'; minutes: number }

export type WorkoutSessionChromeControlsValue = {
  exerciseId: string
  restDurationMinutes: number
  isRunning: boolean
  resetStopEnabled: boolean
  isModelReady: boolean
  isCameraInitializing: boolean
  dispatchChromeControl: (action: WorkoutSessionChromeControlAction) => void
}

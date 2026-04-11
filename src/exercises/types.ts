import type { PoseLandmarks } from '../services'

export type ExerciseState = Record<string, unknown>

export type DetectorResult<TState extends ExerciseState = ExerciseState> = {
  nextState: TState
  repDelta: number
  phase: string
  metrics: Record<string, number>
  confidence: number
}

export type ExerciseDetector<TState extends ExerciseState = ExerciseState> = {
  id: string
  name: string
  description: string
  isActive?: boolean
  voiceAliases?: string[]
  createState(): TState
  update(landmarks: PoseLandmarks | null, state: TState): DetectorResult<TState>
}

export type ExerciseRuntimeState = {  
  reps: number
  phase: string
  confidence: number
  metrics: Record<string, number>
  isBodyDetected: boolean
}

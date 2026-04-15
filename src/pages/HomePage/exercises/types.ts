import type { PoseLandmarks } from '../../../utils/pose'

export type { ExerciseRuntimeState } from '../../../types/exerciseRuntime'

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

import type { PoseLandmarks } from '@utils';

export type { ExerciseRuntimeState } from '@types';

export type ExerciseState = Record<string, unknown>;

export type DetectorResult<TState extends ExerciseState = ExerciseState> = {
  nextState: TState;
  repDelta: number;
  phase: string;
  metrics: Record<string, number>;
  confidence: number;
};

export type ExerciseDetector<TState extends ExerciseState = ExerciseState> = {
  id: string;
  createState(): TState;
  update(landmarks: PoseLandmarks | null, state: TState): DetectorResult<TState>;
};

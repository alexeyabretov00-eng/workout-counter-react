import { bicepsCurlDetector } from './bicepsCurlDetector'
import { squatDetector } from './squatDetector'
import { armyPressDetector } from './armyPressDetector'
import type { ExerciseDetector } from './types'

export const exerciseRegistry: ExerciseDetector[] = [
  bicepsCurlDetector,
  squatDetector,
  armyPressDetector,
]

export function getExerciseById(id: string): ExerciseDetector {
  return exerciseRegistry.find((exercise) => exercise.id === id) ?? exerciseRegistry[0]
}

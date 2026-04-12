import { createContext, useContext } from 'react'
import type { WorkoutSessionStageValue } from './types'

export const WorkoutSessionStageContext = createContext<WorkoutSessionStageValue | null>(null)

export const useWorkoutSessionStageContext = (): WorkoutSessionStageValue => {
  const value = useContext(WorkoutSessionStageContext)
  if (!value) {
    throw new Error('WorkoutSessionStageContext: provider is missing')
  }
  return value
}

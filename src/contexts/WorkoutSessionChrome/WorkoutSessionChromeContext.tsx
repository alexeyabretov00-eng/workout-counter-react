import { createContext, useContext } from 'react'
import type { WorkoutSessionChromeValue } from './types'

export const WorkoutSessionChromeContext = createContext<WorkoutSessionChromeValue | null>(null)

export function useWorkoutSessionChromeContext(): WorkoutSessionChromeValue {
  const value = useContext(WorkoutSessionChromeContext)
  if (!value) {
    throw new Error('WorkoutSessionChromeContext: provider is missing')
  }
  return value
}

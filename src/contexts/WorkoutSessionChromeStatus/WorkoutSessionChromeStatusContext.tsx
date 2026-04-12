import { createContext, useContext } from 'react'
import type { WorkoutSessionChromeStatusValue } from './types'

export const WorkoutSessionChromeStatusContext = createContext<WorkoutSessionChromeStatusValue | null>(null)

export function useWorkoutSessionChromeStatusContext(): WorkoutSessionChromeStatusValue {
  const value = useContext(WorkoutSessionChromeStatusContext)
  if (!value) {
    throw new Error('WorkoutSessionChromeStatusContext: provider is missing')
  }
  return value
}

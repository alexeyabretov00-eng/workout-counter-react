import { createContext, useContext } from 'react'
import type { WorkoutSessionChromeControlsValue } from './types'

export const WorkoutSessionChromeControlsContext = createContext<WorkoutSessionChromeControlsValue | null>(null)

export function useWorkoutSessionChromeControlsContext(): WorkoutSessionChromeControlsValue {
  const value = useContext(WorkoutSessionChromeControlsContext)
  if (!value) {
    throw new Error('WorkoutSessionChromeControlsContext: provider is missing')
  }
  return value
}

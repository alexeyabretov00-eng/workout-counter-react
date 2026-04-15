import { createContext, useContext } from 'react'
import type { AuthSessionValue } from './types'

export const AuthSessionContext = createContext<AuthSessionValue | null>(null)

export const useAuthSessionContext = (): AuthSessionValue => {
  const value = useContext(AuthSessionContext)
  if (!value) {
    throw new Error('AuthSessionContext: provider is missing')
  }
  return value
}

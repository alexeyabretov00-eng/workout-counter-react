import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { authLogin, authLogout, authMe, authRegister } from '../../api'
import { AuthSessionContext } from './AuthSessionContext'
import type { AuthUser } from './types'

type AuthSessionProviderProps = {
  children: ReactNode
}

export const AuthSessionProvider = ({ children }: AuthSessionProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready'>('loading')

  const refresh = useCallback(async () => {
    const result = await authMe()
    if (result?.user) {
      setUser(result.user)
    } else {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        await refresh()
      } catch {
        if (!cancelled) {
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setStatus('ready')
        }
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [refresh])

  const loginWithPassword = useCallback(async (login: string, password: string) => {
    const result = await authLogin(login, password)
    setUser(result.user)
  }, [])

  const registerWithPassword = useCallback(async (login: string, password: string) => {
    const result = await authRegister(login, password)
    setUser(result.user)
  }, [])

  const logout = useCallback(async () => {
    await authLogout()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      status,
      loginWithPassword,
      registerWithPassword,
      logout,
      refresh,
    }),
    [user, status, loginWithPassword, registerWithPassword, logout, refresh],
  )

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>
}

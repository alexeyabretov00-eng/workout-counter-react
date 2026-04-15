import { lazy } from 'react'

export const LoginPageLazy = lazy(async () => {
  const { LoginPage } = await import('./LoginPage')
  return { default: LoginPage }
})

import { lazy } from 'react'

export const RegisterPageLazy = lazy(async () => {
  const { RegisterPage } = await import('./RegisterPage')
  return { default: RegisterPage }
})

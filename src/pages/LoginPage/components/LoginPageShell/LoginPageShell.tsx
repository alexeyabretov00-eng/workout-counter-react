import type { ReactNode } from 'react'
import { LoginPageRoot, LoginPageTitle } from './LoginPageShell.styled'

export type LoginPageShellProps = {
  title: string
  children: ReactNode
}

export const LoginPageShell = ({ title, children }: LoginPageShellProps) => {
  return (
    <LoginPageRoot>
      <LoginPageTitle>{title}</LoginPageTitle>
      {children}
    </LoginPageRoot>
  )
}

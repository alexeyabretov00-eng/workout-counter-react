import type { ReactNode } from 'react'
import './Button.css'

export type ButtonProps = {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  ariaLabel?: string
}

export const Button = ({ children, onClick, disabled, ariaLabel }: ButtonProps) => {
  return (
    <button type="button" className="button__root" onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  )
}

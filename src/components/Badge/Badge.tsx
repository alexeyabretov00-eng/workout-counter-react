import type { ReactNode } from 'react'

import { BadgeRoot, type BadgeVariant } from './Badge.styled'

export type { BadgeVariant }

export type BadgeProps = {
  children: ReactNode
  variant: BadgeVariant
}

export const Badge = ({ children, variant }: BadgeProps) => {
  return <BadgeRoot $variant={variant}>{children}</BadgeRoot>
}

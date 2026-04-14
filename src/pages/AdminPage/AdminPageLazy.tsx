import { lazy } from 'react'

export const AdminPageLazy = lazy(async () => {
  const { AdminPage } = await import('./AdminPage')
  return { default: AdminPage }
})

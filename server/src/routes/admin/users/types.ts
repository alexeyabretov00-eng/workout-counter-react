import type { DatabaseSync } from 'node:sqlite'

export type AdminUserRouteDeps = {
  db: DatabaseSync
  jwtSecret: string
}

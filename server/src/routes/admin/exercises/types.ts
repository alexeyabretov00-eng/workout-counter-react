import type { DatabaseSync } from 'node:sqlite'

export type AdminExerciseRouteDeps = {
  db: DatabaseSync
  jwtSecret: string
}

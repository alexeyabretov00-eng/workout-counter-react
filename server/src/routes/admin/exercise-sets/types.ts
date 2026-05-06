import type { DatabaseSync } from 'node:sqlite'

export type AdminExerciseSetRouteDeps = {
  db: DatabaseSync
  jwtSecret: string
}

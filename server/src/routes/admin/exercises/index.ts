import type { DatabaseSync } from 'node:sqlite'

import express from 'express'

import { registerArchiveExerciseRoute } from './archiveExerciseRoute.js'
import { registerCreateExerciseRoute } from './createExerciseRoute.js'
import { registerListExercisesRoute } from './listExercisesRoute.js'
import { registerUpdateExerciseRoute } from './updateExerciseRoute.js'

export const createAdminExerciseRouter = (db: DatabaseSync, jwtSecret: string): express.Router => {
  const router = express.Router()
  const deps = { db, jwtSecret }

  registerCreateExerciseRoute(router, deps)
  registerListExercisesRoute(router, deps)
  registerUpdateExerciseRoute(router, deps)
  registerArchiveExerciseRoute(router, deps)

  return router
}

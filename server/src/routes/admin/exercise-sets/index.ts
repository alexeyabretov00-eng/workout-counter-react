import type { DatabaseSync } from 'node:sqlite'

import express from 'express'

import { registerCreateExerciseSetRoute } from './createExerciseSetRoute.js'
import { registerDeleteExerciseSetRoute } from './deleteExerciseSetRoute.js'
import { registerListAssignableUsersRoute } from './listAssignableUsersRoute.js'
import { registerListExerciseSetsRoute } from './listExerciseSetsRoute.js'
import { registerUpdateExerciseSetRoute } from './updateExerciseSetRoute.js'

export const createAdminExerciseSetRouter = (db: DatabaseSync, jwtSecret: string): express.Router => {
  const router = express.Router()
  const deps = { db, jwtSecret }

  registerListExerciseSetsRoute(router, deps)
  registerCreateExerciseSetRoute(router, deps)
  registerUpdateExerciseSetRoute(router, deps)
  registerDeleteExerciseSetRoute(router, deps)
  registerListAssignableUsersRoute(router, deps)

  return router
}

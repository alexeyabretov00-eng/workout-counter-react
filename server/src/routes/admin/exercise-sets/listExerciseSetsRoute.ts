import type express from 'express'

import { buildExerciseSetResponse } from '../../../apiResponses.js'
import { listExerciseSets } from '../../../db.js'
import { requireAuthenticatedUser } from '../../guards.js'

import type { AdminExerciseSetRouteDeps } from './types.js'

export const registerListExerciseSetsRoute = (
  router: express.Router,
  deps: AdminExerciseSetRouteDeps,
): void => {
  const { db, jwtSecret } = deps

  router.get('/admin/exercise-sets', (req, res) => {
    const user = requireAuthenticatedUser(db, jwtSecret, req, res)
    if (!user) {
      return
    }

    const sets = listExerciseSets(db).map(buildExerciseSetResponse)
    res.status(200).json({ sets })
  })
}

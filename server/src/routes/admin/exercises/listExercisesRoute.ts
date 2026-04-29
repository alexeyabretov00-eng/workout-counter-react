import type express from 'express'

import { buildExerciseResponse } from '../../../apiResponses.js'
import { listExercises } from '../../../db.js'
import { requireAuthorizedUser } from '../../guards.js'

import type { AdminExerciseRouteDeps } from './types.js'

export const registerListExercisesRoute = (
  router: express.Router,
  deps: AdminExerciseRouteDeps,
): void => {
  const { db, jwtSecret } = deps

  router.get('/admin/exercises', (req, res) => {
    const user = requireAuthorizedUser(db, jwtSecret, req, res, ['admin', 'superadmin'])
    if (!user) {
      return
    }

    const exercises = listExercises(db).map(buildExerciseResponse)
    res.status(200).json({ exercises })
  })
}

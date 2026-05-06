import type express from 'express'

import { buildAdminUserResponse } from '../../../apiResponses.js'
import { listUsers } from '../../../db.js'
import { requireAuthorizedUser } from '../../guards.js'

import type { AdminExerciseSetRouteDeps } from './types.js'

export const registerListAssignableUsersRoute = (
  router: express.Router,
  deps: AdminExerciseSetRouteDeps,
): void => {
  const { db, jwtSecret } = deps

  router.get('/admin/exercise-sets/assignable-users', (req, res) => {
    const user = requireAuthorizedUser(db, jwtSecret, req, res, ['admin', 'superadmin'])
    if (!user) {
      return
    }

    const users = listUsers(db).map(buildAdminUserResponse)
    res.status(200).json({ users })
  })
}

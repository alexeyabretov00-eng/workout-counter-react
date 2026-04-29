import type express from 'express'

import { buildAdminUserResponse } from '../../../apiResponses.js'
import { listUsers } from '../../../db.js'
import { requireAuthorizedUser } from '../../guards.js'

import type { AdminUserRouteDeps } from './types.js'

export const registerListUsersRoute = (router: express.Router, deps: AdminUserRouteDeps): void => {
  const { db, jwtSecret } = deps

  router.get('/admin/users', (req, res) => {
    const user = requireAuthorizedUser(db, jwtSecret, req, res, ['superadmin'])
    if (!user) {
      return
    }

    const users = listUsers(db).map(buildAdminUserResponse)
    res.status(200).json({ users })
  })
}

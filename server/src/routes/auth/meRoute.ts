import type express from 'express'

import { buildUserResponse } from '../../apiResponses.js'
import { requireAuthenticatedUser } from '../guards.js'

import type { AuthRouteDeps } from './types.js'

export const registerMeRoute = (router: express.Router, deps: AuthRouteDeps): void => {
  const { db, jwtSecret } = deps

  router.get('/me', (req, res) => {
    const user = requireAuthenticatedUser(db, jwtSecret, req, res)
    if (!user) {
      return
    }
    res.status(200).json(buildUserResponse(user.id, user.login, user.role, user.mustChangePassword))
  })
}

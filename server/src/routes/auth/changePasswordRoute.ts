import bcrypt from 'bcrypt'
import type express from 'express'

import { buildUserResponse } from '../../apiResponses.js'
import { BCRYPT_ROUNDS } from '../../config.js'
import { findUserById, updateUserPassword } from '../../db.js'
import { sendError } from '../../httpErrors.js'
import { validatePassword } from '../../validation.js'
import { requireAuthenticatedUser } from '../guards.js'

import type { AuthRouteDeps } from './types.js'

export const registerChangePasswordRoute = (router: express.Router, deps: AuthRouteDeps): void => {
  const { db, jwtSecret } = deps

  router.post('/change-password', async (req, res) => {
    const user = requireAuthenticatedUser(db, jwtSecret, req, res)
    if (!user) {
      return
    }

    const parsedPassword = validatePassword(req.body?.password)
    if (Array.isArray(parsedPassword)) {
      const message = parsedPassword.map((issue) => issue.message).join(' ')
      sendError(res, 400, 'VALIDATION_ERROR', message)
      return
    }

    const passwordHash = await bcrypt.hash(parsedPassword, BCRYPT_ROUNDS)
    updateUserPassword(db, user.id, passwordHash, false)

    const fresh = findUserById(db, user.id)
    if (!fresh) {
      sendError(res, 500, 'INTERNAL', 'Не удалось обновить пользователя.')
      return
    }
    res.status(200).json(buildUserResponse(fresh.id, fresh.login, fresh.role, false))
  })
}

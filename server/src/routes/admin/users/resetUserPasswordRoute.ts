import bcrypt from 'bcrypt'
import type express from 'express'

import { buildAdminUserResponse } from '../../../apiResponses.js'
import { ADMIN_RESET_PASSWORD, BCRYPT_ROUNDS } from '../../../config.js'
import { findUserById, updateUserPassword } from '../../../db.js'
import { sendError } from '../../../httpErrors.js'
import { requireAuthorizedUser } from '../../guards.js'

import type { AdminUserRouteDeps } from './types.js'

export const registerResetUserPasswordRoute = (
  router: express.Router,
  deps: AdminUserRouteDeps,
): void => {
  const { db, jwtSecret } = deps

  router.post('/admin/users/:id/reset-password', async (req, res) => {
    const actor = requireAuthorizedUser(db, jwtSecret, req, res, ['superadmin'])
    if (!actor) {
      return
    }

    const id = Number.parseInt(req.params.id, 10)
    if (!Number.isInteger(id) || id <= 0) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Некорректный id пользователя.')
      return
    }

    const target = findUserById(db, id)
    if (!target) {
      sendError(res, 404, 'NOT_FOUND', 'Пользователь не найден.')
      return
    }

    const passwordHash = await bcrypt.hash(ADMIN_RESET_PASSWORD, BCRYPT_ROUNDS)
    updateUserPassword(db, id, passwordHash, true)

    const fresh = findUserById(db, id)
    if (!fresh) {
      sendError(res, 404, 'NOT_FOUND', 'Пользователь не найден.')
      return
    }

    res.status(200).json({ user: buildAdminUserResponse(fresh) })
  })
}

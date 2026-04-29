import type express from 'express'

import { buildAdminUserResponse } from '../../../apiResponses.js'
import { findUserById, updateUserRole } from '../../../db.js'
import { sendError } from '../../../httpErrors.js'
import { validateUserRole } from '../../../validation.js'
import { requireAuthorizedUser } from '../../guards.js'

import type { AdminUserRouteDeps } from './types.js'

export const registerUpdateUserRoleRoute = (
  router: express.Router,
  deps: AdminUserRouteDeps,
): void => {
  const { db, jwtSecret } = deps

  router.patch('/admin/users/:id', (req, res) => {
    const actor = requireAuthorizedUser(db, jwtSecret, req, res, ['superadmin'])
    if (!actor) {
      return
    }

    const id = Number.parseInt(req.params.id, 10)
    if (!Number.isInteger(id) || id <= 0) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Некорректный id пользователя.')
      return
    }

    const parsedRole = validateUserRole(req.body?.role)
    if (Array.isArray(parsedRole)) {
      const message = parsedRole.map((issue) => issue.message).join(' ')
      sendError(res, 400, 'VALIDATION_ERROR', message)
      return
    }

    if (actor.id === id && parsedRole !== 'superadmin') {
      sendError(res, 400, 'VALIDATION_ERROR', 'Нельзя понизить свою роль superadmin.')
      return
    }

    const updated = updateUserRole(db, id, parsedRole)
    if (!updated) {
      sendError(res, 404, 'NOT_FOUND', 'Пользователь не найден.')
      return
    }

    const fresh = findUserById(db, id)
    if (!fresh) {
      sendError(res, 404, 'NOT_FOUND', 'Пользователь не найден.')
      return
    }
    res.status(200).json({ user: buildAdminUserResponse(fresh) })
  })
}

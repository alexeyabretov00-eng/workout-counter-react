import type { DatabaseSync } from 'node:sqlite'

import bcrypt from 'bcrypt'
import express from 'express'

import { buildAdminUserResponse } from '../apiResponses.js'
import { ADMIN_RESET_PASSWORD, BCRYPT_ROUNDS } from '../config.js'
import { findUserById, listUsers, updateUserPassword, updateUserRole } from '../db.js'
import { sendError } from '../httpErrors.js'
import { validateUserRole } from '../validation.js'

import { requireAuthorizedUser } from './guards.js'

export const createAdminUserRouter = (db: DatabaseSync, jwtSecret: string): express.Router => {
  const router = express.Router()

  router.get('/admin/users', (req, res) => {
    const user = requireAuthorizedUser(db, jwtSecret, req, res, ['superadmin'])
    if (!user) {
      return
    }

    const users = listUsers(db).map(buildAdminUserResponse)
    res.status(200).json({ users })
  })

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

  return router
}

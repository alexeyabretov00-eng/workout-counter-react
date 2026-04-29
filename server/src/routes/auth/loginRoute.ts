import bcrypt from 'bcrypt'
import type express from 'express'

import { buildUserResponse } from '../../apiResponses.js'
import { AUTH_COOKIE_NAME, getCookieOptions, signToken } from '../../auth.js'
import { findUserByLogin } from '../../db.js'
import { sendError } from '../../httpErrors.js'
import { validateCredentials } from '../../validation.js'

import type { AuthRouteDeps } from './types.js'

export const registerLoginRoute = (router: express.Router, deps: AuthRouteDeps): void => {
  const { db, jwtSecret, authRouteLimiter } = deps

  router.post('/login', authRouteLimiter, async (req, res) => {
    const parsed = validateCredentials(req.body?.login, req.body?.password)
    if (Array.isArray(parsed)) {
      const message = parsed.map((issue) => issue.message).join(' ')
      sendError(res, 400, 'VALIDATION_ERROR', message)
      return
    }

    const row = findUserByLogin(db, parsed.login)
    if (!row) {
      sendError(res, 401, 'INVALID_CREDENTIALS', 'Неверный логин или пароль.')
      return
    }

    const match = await bcrypt.compare(parsed.password, row.password_hash)
    if (!match) {
      sendError(res, 401, 'INVALID_CREDENTIALS', 'Неверный логин или пароль.')
      return
    }

    const token = signToken(jwtSecret, { sub: row.id, login: row.login })
    res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions())
    res
      .status(200)
      .json(buildUserResponse(row.id, row.login, row.role, row.must_change_password === 1))
  })
}

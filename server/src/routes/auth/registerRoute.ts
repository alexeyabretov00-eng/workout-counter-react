import bcrypt from 'bcrypt'
import type express from 'express'

import { buildUserResponse } from '../../apiResponses.js'
import { AUTH_COOKIE_NAME, getCookieOptions, signToken } from '../../auth.js'
import { BCRYPT_ROUNDS } from '../../config.js'
import { insertUser } from '../../db.js'
import { sendError } from '../../httpErrors.js'
import { validateCredentials } from '../../validation.js'

import type { AuthRouteDeps } from './types.js'

export const registerRegisterRoute = (router: express.Router, deps: AuthRouteDeps): void => {
  const { db, jwtSecret, authRouteLimiter } = deps

  router.post('/register', authRouteLimiter, async (req, res) => {
    const parsed = validateCredentials(req.body?.login, req.body?.password)
    if (Array.isArray(parsed)) {
      const message = parsed.map((issue) => issue.message).join(' ')
      sendError(res, 400, 'VALIDATION_ERROR', message)
      return
    }

    const passwordHash = await bcrypt.hash(parsed.password, BCRYPT_ROUNDS)

    try {
      const id = insertUser(db, parsed.login, passwordHash)
      const token = signToken(jwtSecret, { sub: id, login: parsed.login })
      res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions())
      res.status(201).json(buildUserResponse(id, parsed.login, 'user', false))
    } catch (error: unknown) {
      const errcode =
        typeof error === 'object' && error !== null && 'errcode' in error
          ? (error as { errcode?: number }).errcode
          : undefined
      const message = error instanceof Error ? error.message : ''
      if (errcode === 2067 || message.includes('UNIQUE')) {
        sendError(res, 409, 'LOGIN_IN_USE', 'Этот логин уже занят.')
        return
      }
      sendError(res, 500, 'INTERNAL', 'Не удалось зарегистрировать пользователя.')
    }
  })
}

import type { DatabaseSync } from 'node:sqlite'

import bcrypt from 'bcrypt'
import express from 'express'
import type { RateLimitRequestHandler } from 'express-rate-limit'

import { buildUserResponse } from '../apiResponses.js'
import { AUTH_COOKIE_NAME, getCookieOptions, signToken } from '../auth.js'
import { BCRYPT_ROUNDS } from '../config.js'
import { findUserById, findUserByLogin, insertUser, updateUserPassword } from '../db.js'
import { sendError } from '../httpErrors.js'
import { validateCredentials, validatePassword } from '../validation.js'

import { requireAuthenticatedUser } from './guards.js'

export const createAuthRouter = (
  db: DatabaseSync,
  jwtSecret: string,
  authRouteLimiter: RateLimitRequestHandler,
): express.Router => {
  const router = express.Router()

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

  router.post('/logout', (req, res) => {
    const opts = getCookieOptions()
    res.clearCookie(AUTH_COOKIE_NAME, {
      path: '/',
      sameSite: opts.sameSite,
      httpOnly: true,
      secure: opts.secure,
    })
    res.status(200).json({ ok: true })
  })

  router.get('/me', (req, res) => {
    const user = requireAuthenticatedUser(db, jwtSecret, req, res)
    if (!user) {
      return
    }
    res.status(200).json(buildUserResponse(user.id, user.login, user.role, user.mustChangePassword))
  })

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

  return router
}

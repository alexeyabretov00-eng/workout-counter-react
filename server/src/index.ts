import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import express from 'express'
import rateLimit from 'express-rate-limit'
import type { DatabaseSync } from 'node:sqlite'
import { AUTH_COOKIE_NAME, getCookieOptions, requireUser, signToken } from './auth.js'
import { findUserByLogin, insertUser, openDatabase } from './db.js'
import { sendError } from './httpErrors.js'
import { validateCredentials } from './validation.js'

const DEFAULT_PORT = 3001
const BCRYPT_ROUNDS = 10

const resolveJwtSecret = (): string => {
  const fromEnv = process.env.JWT_SECRET
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production')
  }
  return 'dev-insecure-jwt-secret-change-me'
}

const resolveDatabasePath = (): string => {
  return process.env.DATABASE_PATH ?? './data/app.sqlite'
}

const buildUserResponse = (id: number, login: string) => ({
  user: {
    id,
    login,
  },
})

const createApp = (db: DatabaseSync, jwtSecret: string) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(cookieParser())
  app.use(express.json({ limit: '32kb' }))

  const authRouteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })

  const api = express.Router()

  api.get('/health', (_req, res) => {
    res.status(200).json({ ok: true })
  })

  api.post('/register', authRouteLimiter, async (req, res) => {
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
      res.status(201).json(buildUserResponse(id, parsed.login))
    } catch (error: unknown) {
      const errcode = typeof error === 'object' && error !== null && 'errcode' in error ? (error as { errcode?: number }).errcode : undefined
      const message = error instanceof Error ? error.message : ''
      if (errcode === 2067 || message.includes('UNIQUE')) {
        sendError(res, 409, 'LOGIN_IN_USE', 'Этот логин уже занят.')
        return
      }
      sendError(res, 500, 'INTERNAL', 'Не удалось зарегистрировать пользователя.')
    }
  })

  api.post('/login', authRouteLimiter, async (req, res) => {
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
    res.status(200).json(buildUserResponse(row.id, row.login))
  })

  api.post('/logout', (req, res) => {
    const opts = getCookieOptions()
    res.clearCookie(AUTH_COOKIE_NAME, {
      path: '/',
      sameSite: opts.sameSite,
      httpOnly: true,
      secure: opts.secure,
    })
    res.status(200).json({ ok: true })
  })

  api.get('/me', (req, res) => {
    const user = requireUser(db, jwtSecret, req)
    if (!user) {
      sendError(res, 401, 'UNAUTHORIZED', 'Требуется вход.')
      return
    }
    res.status(200).json(buildUserResponse(user.id, user.login))
  })

  api.get('/ping-protected', (req, res) => {
    const user = requireUser(db, jwtSecret, req)
    if (!user) {
      sendError(res, 401, 'UNAUTHORIZED', 'Требуется вход.')
      return
    }
    res.status(200).json({ ok: true, login: user.login })
  })

  app.use('/api', api)

  return app
}

const port = Number.parseInt(process.env.PORT ?? String(DEFAULT_PORT), 10)
const databasePath = resolveDatabasePath()
const jwtSecret = resolveJwtSecret()
const db = openDatabase(databasePath)
const app = createApp(db, jwtSecret)

app.listen(port, () => {
  console.log(`API listening on http://127.0.0.1:${port} (database: ${databasePath})`)
})

export { createApp, resolveDatabasePath, resolveJwtSecret }

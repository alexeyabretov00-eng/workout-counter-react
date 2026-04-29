import type { DatabaseSync } from 'node:sqlite'

import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import express from 'express'
import rateLimit from 'express-rate-limit'

import { AUTH_COOKIE_NAME, getCookieOptions, requireUser, signToken } from './auth.js'
import {
  archiveExercise,
  createExercise,
  findExerciseById,
  findUserById,
  findUserByLogin,
  insertUser,
  listExercises,
  listUsers,
  openDatabase,
  updateExercise,
  updateUserPassword,
  updateUserRole,
  upsertSeededUser,
  type UserRole,
} from './db.js'
import { sendError } from './httpErrors.js'
import {
  validateCreateExerciseInput,
  validateCredentials,
  validatePassword,
  validateUpdateExerciseInput,
  validateUserRole,
} from './validation.js'

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

const buildUserResponse = (
  id: number,
  login: string,
  role: UserRole,
  mustChangePassword: boolean,
) => ({
  user: {
    id,
    login,
    role,
    mustChangePassword,
  },
})

const buildAdminUserResponse = (row: ReturnType<typeof listUsers>[number]) => ({
  id: row.id,
  login: row.login,
  role: row.role,
  mustChangePassword: row.must_change_password === 1,
  createdAt: row.created_at,
})

const requireRole = (
  user: ReturnType<typeof requireUser>,
  roles: UserRole[],
): user is NonNullable<ReturnType<typeof requireUser>> => {
  return Boolean(user && roles.includes(user.role))
}

const seedDefaultAdmins = (db: DatabaseSync) => {
  const defaultPasswordHash = bcrypt.hashSync('12345678', BCRYPT_ROUNDS)
  upsertSeededUser(db, 'admin', defaultPasswordHash, 'admin', true)
  upsertSeededUser(db, 'superadmin', defaultPasswordHash, 'superadmin', true)
}

const parseVoiceAliases = (raw: string): string[] => {
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter((item): item is string => typeof item === 'string')
  } catch {
    return []
  }
}

const buildExerciseResponse = (
  exercise: ReturnType<typeof listExercises>[number],
): {
  id: number
  slug: string
  name: string
  description: string
  detectorKey: string
  voiceAliases: string[]
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
} => {
  return {
    id: exercise.id,
    slug: exercise.slug,
    name: exercise.name,
    description: exercise.description,
    detectorKey: exercise.detector_key,
    voiceAliases: parseVoiceAliases(exercise.voice_aliases_json),
    sortOrder: exercise.sort_order,
    isActive: exercise.is_active === 1,
    createdAt: exercise.created_at,
    updatedAt: exercise.updated_at,
  }
}

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

  api.get('/exercises', (_req, res) => {
    const exercises = listExercises(db)
      .filter((exercise) => exercise.is_active === 1)
      .map(buildExerciseResponse)
    res.status(200).json({ exercises })
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
      res.status(201).json(buildUserResponse(id, parsed.login, 'user', false))
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
    res
      .status(200)
      .json(buildUserResponse(row.id, row.login, row.role, row.must_change_password === 1))
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
    res.status(200).json(buildUserResponse(user.id, user.login, user.role, user.mustChangePassword))
  })

  api.get('/ping-protected', (req, res) => {
    const user = requireUser(db, jwtSecret, req)
    if (!requireRole(user, ['admin', 'superadmin'])) {
      if (!user) {
        sendError(res, 401, 'UNAUTHORIZED', 'Требуется вход.')
        return
      }
      sendError(res, 403, 'FORBIDDEN', 'Недостаточно прав.')
      return
    }

    res.status(200).json({ ok: true, login: user.login })
  })

  api.post('/admin/exercises', (req, res) => {
    const user = requireUser(db, jwtSecret, req)
    if (!requireRole(user, ['admin', 'superadmin'])) {
      if (!user) {
        sendError(res, 401, 'UNAUTHORIZED', 'Требуется вход.')
        return
      }
      sendError(res, 403, 'FORBIDDEN', 'Недостаточно прав.')
      return
    }

    const parsed = validateCreateExerciseInput(req.body)
    if (Array.isArray(parsed)) {
      const message = parsed.map((issue) => issue.message).join(' ')
      sendError(res, 400, 'VALIDATION_ERROR', message)
      return
    }

    try {
      const id = createExercise(db, {
        slug: parsed.slug,
        name: parsed.name,
        description: parsed.description,
        detectorKey: parsed.detectorKey,
        voiceAliasesJson: JSON.stringify(parsed.voiceAliases),
        sortOrder: parsed.sortOrder,
        isActive: parsed.isActive,
      })
      const exercise = findExerciseById(db, id)
      if (!exercise) {
        sendError(res, 500, 'INTERNAL', 'Не удалось прочитать созданное упражнение.')
        return
      }
      res.status(201).json({ exercise: buildExerciseResponse(exercise) })
    } catch (error: unknown) {
      const errcode =
        typeof error === 'object' && error !== null && 'errcode' in error
          ? (error as { errcode?: number }).errcode
          : undefined
      const message = error instanceof Error ? error.message : ''
      if (errcode === 2067 || message.includes('UNIQUE')) {
        sendError(res, 409, 'EXERCISE_CONFLICT', 'Упражнение с таким slug уже существует.')
        return
      }
      sendError(res, 500, 'INTERNAL', 'Не удалось создать упражнение.')
    }
  })

  api.get('/admin/exercises', (req, res) => {
    const user = requireUser(db, jwtSecret, req)
    if (!requireRole(user, ['admin', 'superadmin'])) {
      if (!user) {
        sendError(res, 401, 'UNAUTHORIZED', 'Требуется вход.')
        return
      }
      sendError(res, 403, 'FORBIDDEN', 'Недостаточно прав.')
      return
    }

    const exercises = listExercises(db).map(buildExerciseResponse)
    res.status(200).json({ exercises })
  })

  api.patch('/admin/exercises/:id', (req, res) => {
    const user = requireUser(db, jwtSecret, req)
    if (!requireRole(user, ['admin', 'superadmin'])) {
      if (!user) {
        sendError(res, 401, 'UNAUTHORIZED', 'Требуется вход.')
        return
      }
      sendError(res, 403, 'FORBIDDEN', 'Недостаточно прав.')
      return
    }

    const id = Number.parseInt(req.params.id, 10)
    if (!Number.isInteger(id) || id <= 0) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Некорректный id упражнения.')
      return
    }

    const parsed = validateUpdateExerciseInput(req.body)
    if (Array.isArray(parsed)) {
      const message = parsed.map((issue) => issue.message).join(' ')
      sendError(res, 400, 'VALIDATION_ERROR', message)
      return
    }

    try {
      const changed = updateExercise(db, id, {
        slug: parsed.slug,
        name: parsed.name,
        description: parsed.description,
        detectorKey: parsed.detectorKey,
        voiceAliasesJson:
          parsed.voiceAliases !== undefined ? JSON.stringify(parsed.voiceAliases) : undefined,
        sortOrder: parsed.sortOrder,
        isActive: parsed.isActive,
      })
      if (!changed) {
        sendError(res, 404, 'NOT_FOUND', 'Упражнение не найдено.')
        return
      }
      const exercise = findExerciseById(db, id)
      if (!exercise) {
        sendError(res, 404, 'NOT_FOUND', 'Упражнение не найдено.')
        return
      }
      res.status(200).json({ exercise: buildExerciseResponse(exercise) })
    } catch (error: unknown) {
      const errcode =
        typeof error === 'object' && error !== null && 'errcode' in error
          ? (error as { errcode?: number }).errcode
          : undefined
      const message = error instanceof Error ? error.message : ''
      if (errcode === 2067 || message.includes('UNIQUE')) {
        sendError(res, 409, 'EXERCISE_CONFLICT', 'Упражнение с таким slug уже существует.')
        return
      }
      sendError(res, 500, 'INTERNAL', 'Не удалось обновить упражнение.')
    }
  })

  api.delete('/admin/exercises/:id', (req, res) => {
    const user = requireUser(db, jwtSecret, req)
    if (!requireRole(user, ['admin', 'superadmin'])) {
      if (!user) {
        sendError(res, 401, 'UNAUTHORIZED', 'Требуется вход.')
        return
      }
      sendError(res, 403, 'FORBIDDEN', 'Недостаточно прав.')
      return
    }

    const id = Number.parseInt(req.params.id, 10)
    if (!Number.isInteger(id) || id <= 0) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Некорректный id упражнения.')
      return
    }

    const archived = archiveExercise(db, id)
    if (!archived) {
      sendError(res, 404, 'NOT_FOUND', 'Упражнение не найдено.')
      return
    }
    res.status(200).json({ ok: true })
  })

  api.post('/change-password', async (req, res) => {
    const user = requireUser(db, jwtSecret, req)
    if (!user) {
      sendError(res, 401, 'UNAUTHORIZED', 'Требуется вход.')
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

  api.get('/admin/users', (req, res) => {
    const user = requireUser(db, jwtSecret, req)
    if (!requireRole(user, ['superadmin'])) {
      if (!user) {
        sendError(res, 401, 'UNAUTHORIZED', 'Требуется вход.')
        return
      }
      sendError(res, 403, 'FORBIDDEN', 'Недостаточно прав.')
      return
    }

    const users = listUsers(db).map(buildAdminUserResponse)
    res.status(200).json({ users })
  })

  api.patch('/admin/users/:id', (req, res) => {
    const actor = requireUser(db, jwtSecret, req)
    if (!requireRole(actor, ['superadmin'])) {
      if (!actor) {
        sendError(res, 401, 'UNAUTHORIZED', 'Требуется вход.')
        return
      }
      sendError(res, 403, 'FORBIDDEN', 'Недостаточно прав.')
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

  app.use('/api', api)

  return app
}

const port = Number.parseInt(process.env.PORT ?? String(DEFAULT_PORT), 10)
const databasePath = resolveDatabasePath()
const jwtSecret = resolveJwtSecret()
const db = openDatabase(databasePath)
seedDefaultAdmins(db)
const app = createApp(db, jwtSecret)

app.listen(port, () => {
  console.log(`API listening on http://127.0.0.1:${port} (database: ${databasePath})`)
})

export { createApp, resolveDatabasePath, resolveJwtSecret }

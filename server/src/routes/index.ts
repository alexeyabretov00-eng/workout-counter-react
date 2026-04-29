import type { DatabaseSync } from 'node:sqlite'

import express from 'express'
import rateLimit from 'express-rate-limit'

import { createAdminExerciseRouter } from './adminExerciseRoutes.js'
import { createAdminUserRouter } from './adminUserRoutes.js'
import { createAuthRouter } from './authRoutes.js'
import { createProtectedRouter } from './protectedRoutes.js'
import { createPublicRouter } from './publicRoutes.js'

const createAuthRouteLimiter = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
}

export const createApiRouter = (db: DatabaseSync, jwtSecret: string): express.Router => {
  const router = express.Router()
  const authRouteLimiter = createAuthRouteLimiter()

  router.use(createPublicRouter(db))
  router.use(createAuthRouter(db, jwtSecret, authRouteLimiter))
  router.use(createProtectedRouter(db, jwtSecret))
  router.use(createAdminExerciseRouter(db, jwtSecret))
  router.use(createAdminUserRouter(db, jwtSecret))

  return router
}

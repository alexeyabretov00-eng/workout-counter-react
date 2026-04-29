import type { DatabaseSync } from 'node:sqlite'

import express from 'express'
import type { RateLimitRequestHandler } from 'express-rate-limit'

import { registerChangePasswordRoute } from './changePasswordRoute.js'
import { registerLoginRoute } from './loginRoute.js'
import { registerLogoutRoute } from './logoutRoute.js'
import { registerMeRoute } from './meRoute.js'
import { registerRegisterRoute } from './registerRoute.js'

export const createAuthRouter = (
  db: DatabaseSync,
  jwtSecret: string,
  authRouteLimiter: RateLimitRequestHandler,
): express.Router => {
  const router = express.Router()
  const deps = { db, jwtSecret, authRouteLimiter }

  registerRegisterRoute(router, deps)
  registerLoginRoute(router, deps)
  registerLogoutRoute(router)
  registerMeRoute(router, deps)
  registerChangePasswordRoute(router, deps)

  return router
}

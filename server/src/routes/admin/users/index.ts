import type { DatabaseSync } from 'node:sqlite'

import express from 'express'

import { registerListUsersRoute } from './listUsersRoute.js'
import { registerResetUserPasswordRoute } from './resetUserPasswordRoute.js'
import { registerUpdateUserRoleRoute } from './updateUserRoleRoute.js'

export const createAdminUserRouter = (db: DatabaseSync, jwtSecret: string): express.Router => {
  const router = express.Router()
  const deps = { db, jwtSecret }

  registerListUsersRoute(router, deps)
  registerUpdateUserRoleRoute(router, deps)
  registerResetUserPasswordRoute(router, deps)

  return router
}

import type { DatabaseSync } from 'node:sqlite'

import express from 'express'

import { requireAuthorizedUser } from './guards.js'

export const createProtectedRouter = (db: DatabaseSync, jwtSecret: string): express.Router => {
  const router = express.Router()

  router.get('/ping-protected', (req, res) => {
    const user = requireAuthorizedUser(db, jwtSecret, req, res, ['admin', 'superadmin'])
    if (!user) {
      return
    }

    res.status(200).json({ ok: true, login: user.login })
  })

  return router
}

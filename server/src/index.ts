import type { DatabaseSync } from 'node:sqlite'

import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import express from 'express'

import { createApiRouter } from './routes/index.js'
import { BCRYPT_ROUNDS, DEFAULT_PORT, resolveDatabasePath, resolveJwtSecret } from './config.js'
import { openDatabase, upsertSeededUser } from './db.js'

const seedDefaultAdmins = (db: DatabaseSync) => {
  const defaultPasswordHash = bcrypt.hashSync('12345678', BCRYPT_ROUNDS)
  upsertSeededUser(db, 'admin', defaultPasswordHash, 'admin', true)
  upsertSeededUser(db, 'superadmin', defaultPasswordHash, 'superadmin', true)
}

const createApp = (db: DatabaseSync, jwtSecret: string) => {
  const app = express()
  app.disable('x-powered-by')
  app.use(cookieParser())
  app.use(express.json({ limit: '32kb' }))

  app.use('/api', createApiRouter(db, jwtSecret))

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

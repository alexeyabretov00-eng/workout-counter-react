import type { DatabaseSync } from 'node:sqlite'

import type { RateLimitRequestHandler } from 'express-rate-limit'

export type AuthRouteDeps = {
  db: DatabaseSync
  jwtSecret: string
  authRouteLimiter: RateLimitRequestHandler
}

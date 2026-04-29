import type { DatabaseSync } from 'node:sqlite'

import type { Request, Response } from 'express'

import { requireUser } from '../auth.js'
import type { UserRole } from '../db.js'
import { sendError } from '../httpErrors.js'

type RequestUser = NonNullable<ReturnType<typeof requireUser>>

const hasRole = (user: ReturnType<typeof requireUser>, roles: UserRole[]): user is RequestUser => {
  return Boolean(user && roles.includes(user.role))
}

export const requireAuthenticatedUser = (
  db: DatabaseSync,
  jwtSecret: string,
  req: Request,
  res: Response,
): RequestUser | null => {
  const user = requireUser(db, jwtSecret, req)
  if (!user) {
    sendError(res, 401, 'UNAUTHORIZED', 'Требуется вход.')
    return null
  }
  return user
}

export const requireAuthorizedUser = (
  db: DatabaseSync,
  jwtSecret: string,
  req: Request,
  res: Response,
  roles: UserRole[],
): RequestUser | null => {
  const user = requireUser(db, jwtSecret, req)
  if (!hasRole(user, roles)) {
    if (!user) {
      sendError(res, 401, 'UNAUTHORIZED', 'Требуется вход.')
      return null
    }
    sendError(res, 403, 'FORBIDDEN', 'Недостаточно прав.')
    return null
  }

  return user
}

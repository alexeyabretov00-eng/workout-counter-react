import type { DatabaseSync } from 'node:sqlite'

import type { CookieOptions } from 'express'
import type { Request } from 'express'
import jwt from 'jsonwebtoken'

import type { UserRole } from './db.js'
import { findUserById } from './db.js'

export const AUTH_COOKIE_NAME = 'auth_token'

export type AuthTokenPayload = {
  sub: number
  login: string
}

export const signToken = (secret: string, payload: AuthTokenPayload): string => {
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export const verifyToken = (secret: string, token: string): AuthTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, secret)
    if (typeof decoded !== 'object' || decoded === null) {
      return null
    }
    const record = decoded as Record<string, unknown>
    const sub = record.sub
    const login = record.login
    if (typeof sub !== 'number' || typeof login !== 'string') {
      return null
    }
    return { sub, login }
  } catch {
    return null
  }
}

export const getCookieOptions = (): CookieOptions => {
  const secure = process.env.COOKIE_SECURE === 'true'
  return {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure,
  }
}

export const readAuthFromRequest = (req: Request, jwtSecret: string): AuthTokenPayload | null => {
  const raw = req.cookies?.[AUTH_COOKIE_NAME]
  if (typeof raw !== 'string' || raw.length === 0) {
    return null
  }
  return verifyToken(jwtSecret, raw)
}

export const requireUser = (
  db: DatabaseSync,
  jwtSecret: string,
  req: Request,
): { id: number; login: string; role: UserRole; mustChangePassword: boolean } | null => {
  const payload = readAuthFromRequest(req, jwtSecret)
  if (!payload) {
    return null
  }
  const row = findUserById(db, payload.sub)
  if (!row || row.login.toLowerCase() !== payload.login.toLowerCase()) {
    return null
  }
  return {
    id: row.id,
    login: row.login,
    role: row.role,
    mustChangePassword: row.must_change_password === 1,
  }
}

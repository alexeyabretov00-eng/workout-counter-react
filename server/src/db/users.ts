import type { DatabaseSync } from 'node:sqlite'

import type { ListUserRow, UserRole, UserRow } from './types.js'

export const findUserByLogin = (db: DatabaseSync, login: string): UserRow | undefined => {
  const stmt = db.prepare(
    `
      SELECT id, login, password_hash, role, must_change_password, created_at
      FROM users
      WHERE login = ? COLLATE NOCASE
    `,
  )
  const row = stmt.get(login.trim()) as UserRow | undefined
  return row
}

export const findUserById = (db: DatabaseSync, id: number): UserRow | undefined => {
  const stmt = db.prepare(
    `
      SELECT id, login, password_hash, role, must_change_password, created_at
      FROM users
      WHERE id = ?
    `,
  )
  const row = stmt.get(id) as UserRow | undefined
  return row
}

export const insertUser = (db: DatabaseSync, login: string, passwordHash: string): number => {
  const createdAt = new Date().toISOString()
  const stmt = db.prepare(
    `
      INSERT INTO users (login, password_hash, role, must_change_password, created_at)
      VALUES (?, ?, ?, ?, ?)
    `,
  )
  const result = stmt.run(login.trim(), passwordHash, 'user', 0, createdAt)
  return Number(result.lastInsertRowid)
}

export const listUsers = (db: DatabaseSync): ListUserRow[] => {
  const stmt = db.prepare(`
    SELECT id, login, role, must_change_password, created_at
    FROM users
    ORDER BY created_at ASC, id ASC
  `)
  return stmt.all() as ListUserRow[]
}

export const updateUserRole = (db: DatabaseSync, id: number, role: UserRole): boolean => {
  const stmt = db.prepare('UPDATE users SET role = ? WHERE id = ?')
  const result = stmt.run(role, id)
  return Number(result.changes) > 0
}

export const updateUserPassword = (
  db: DatabaseSync,
  id: number,
  passwordHash: string,
  mustChangePassword: boolean,
): boolean => {
  const stmt = db.prepare(
    'UPDATE users SET password_hash = ?, must_change_password = ? WHERE id = ?',
  )
  const result = stmt.run(passwordHash, mustChangePassword ? 1 : 0, id)
  return Number(result.changes) > 0
}

export const upsertSeededUser = (
  db: DatabaseSync,
  login: string,
  passwordHash: string,
  role: UserRole,
  mustChangePassword: boolean,
): number => {
  const existing = findUserByLogin(db, login)
  if (existing) {
    return existing.id
  }

  const createdAt = new Date().toISOString()
  const insertStmt = db.prepare(
    `
      INSERT INTO users (login, password_hash, role, must_change_password, created_at)
      VALUES (?, ?, ?, ?, ?)
    `,
  )
  const result = insertStmt.run(login.trim(), passwordHash, role, mustChangePassword ? 1 : 0, createdAt)
  return Number(result.lastInsertRowid)
}

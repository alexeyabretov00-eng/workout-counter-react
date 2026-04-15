import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

export type UserRow = {
  id: number
  login: string
  password_hash: string
  created_at: string
}

export const openDatabase = (filePath: string): DatabaseSync => {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const db = new DatabaseSync(filePath)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      login TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `)
  db.exec('PRAGMA journal_mode = WAL;')
  return db
}

export const findUserByLogin = (db: DatabaseSync, login: string): UserRow | undefined => {
  const stmt = db.prepare(
    'SELECT id, login, password_hash, created_at FROM users WHERE login = ? COLLATE NOCASE',
  )
  const row = stmt.get(login.trim()) as UserRow | undefined
  return row
}

export const findUserById = (db: DatabaseSync, id: number): UserRow | undefined => {
  const stmt = db.prepare('SELECT id, login, password_hash, created_at FROM users WHERE id = ?')
  const row = stmt.get(id) as UserRow | undefined
  return row
}

export const insertUser = (db: DatabaseSync, login: string, passwordHash: string): number => {
  const createdAt = new Date().toISOString()
  const stmt = db.prepare('INSERT INTO users (login, password_hash, created_at) VALUES (?, ?, ?)')
  const result = stmt.run(login.trim(), passwordHash, createdAt)
  return Number(result.lastInsertRowid)
}

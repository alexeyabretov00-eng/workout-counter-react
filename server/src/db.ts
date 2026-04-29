import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

export type UserRow = {
  id: number
  login: string
  password_hash: string
  role: UserRole
  must_change_password: number
  created_at: string
}

export type UserRole = 'user' | 'admin' | 'superadmin'

export type ExerciseRow = {
  id: number
  slug: string
  name: string
  description: string
  detector_key: string
  voice_aliases_json: string
  sort_order: number
  is_active: number
  created_at: string
  updated_at: string
}

type ExerciseSeed = Omit<ExerciseRow, 'id' | 'created_at' | 'updated_at'>

export type CreateExerciseInput = {
  slug: string
  name: string
  description: string
  detectorKey: string
  voiceAliasesJson: string
  sortOrder: number
  isActive: boolean
}

export type UpdateExerciseInput = Partial<CreateExerciseInput>

const EXERCISE_SEEDS: ExerciseSeed[] = [
  {
    slug: 'biceps-curl',
    name: 'Подъем на бицепс',
    description: 'Классический подъем руки в локте стоя',
    detector_key: 'biceps-curl',
    voice_aliases_json: '["бицепс","подъем на бицепс"]',
    sort_order: 10,
    is_active: 1,
  },
  {
    slug: 'squat',
    name: 'Приседания',
    description: 'Базовые приседания с контролем глубины',
    detector_key: 'squat',
    voice_aliases_json: '["присед","приседания"]',
    sort_order: 20,
    is_active: 1,
  },
  {
    slug: 'army-press',
    name: 'Армейский жим',
    description: 'Жим вверх над головой',
    detector_key: 'army-press',
    voice_aliases_json: '["армейский жим","жим вверх"]',
    sort_order: 30,
    is_active: 1,
  },
  {
    slug: 'head-side-tilt',
    name: 'Наклоны головы вправо-влево',
    description: 'Наклоны головы в стороны с контролем амплитуды',
    detector_key: 'head-side-tilt',
    voice_aliases_json: '["наклоны головы","голова вправо влево"]',
    sort_order: 40,
    is_active: 1,
  },
]

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
      role TEXT NOT NULL DEFAULT 'user',
      must_change_password INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `)
  const userColumns = db
    .prepare('PRAGMA table_info(users)')
    .all() as Array<{ name: string }>
  const hasRoleColumn = userColumns.some((column) => column.name === 'role')
  const hasMustChangeColumn = userColumns.some((column) => column.name === 'must_change_password')

  if (!hasRoleColumn) {
    db.exec(`ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';`)
  }
  if (!hasMustChangeColumn) {
    db.exec(`ALTER TABLE users ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0;`)
  }
  db.exec(
    `UPDATE users SET role = 'user' WHERE role IS NULL OR role NOT IN ('user', 'admin', 'superadmin');`,
  )
  db.exec(`UPDATE users SET must_change_password = 0 WHERE must_change_password IS NULL;`)
  db.exec(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE COLLATE NOCASE,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      detector_key TEXT NOT NULL,
      voice_aliases_json TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `)

  const seedStmt = db.prepare(`
    INSERT OR IGNORE INTO exercises (
      slug,
      name,
      description,
      detector_key,
      voice_aliases_json,
      sort_order,
      is_active,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  for (const exercise of EXERCISE_SEEDS) {
    const nowIso = new Date().toISOString()
    seedStmt.run(
      exercise.slug,
      exercise.name,
      exercise.description,
      exercise.detector_key,
      exercise.voice_aliases_json,
      exercise.sort_order,
      exercise.is_active,
      nowIso,
      nowIso,
    )
  }

  db.exec('PRAGMA journal_mode = WAL;')
  return db
}

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

export type ListUserRow = {
  id: number
  login: string
  role: UserRole
  must_change_password: number
  created_at: string
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

export const listExercises = (db: DatabaseSync): ExerciseRow[] => {
  const stmt = db.prepare(
    `
      SELECT
        id,
        slug,
        name,
        description,
        detector_key,
        voice_aliases_json,
        sort_order,
        is_active,
        created_at,
        updated_at
      FROM exercises
      ORDER BY sort_order ASC, id ASC
    `,
  )
  return stmt.all() as ExerciseRow[]
}

export const findExerciseById = (db: DatabaseSync, id: number): ExerciseRow | undefined => {
  const stmt = db.prepare(
    `
      SELECT
        id,
        slug,
        name,
        description,
        detector_key,
        voice_aliases_json,
        sort_order,
        is_active,
        created_at,
        updated_at
      FROM exercises
      WHERE id = ?
    `,
  )
  return stmt.get(id) as ExerciseRow | undefined
}

export const createExercise = (db: DatabaseSync, input: CreateExerciseInput): number => {
  const nowIso = new Date().toISOString()
  const stmt = db.prepare(`
    INSERT INTO exercises (
      slug,
      name,
      description,
      detector_key,
      voice_aliases_json,
      sort_order,
      is_active,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const result = stmt.run(
    input.slug.trim(),
    input.name.trim(),
    input.description.trim(),
    input.detectorKey.trim(),
    input.voiceAliasesJson,
    input.sortOrder,
    input.isActive ? 1 : 0,
    nowIso,
    nowIso,
  )
  return Number(result.lastInsertRowid)
}

export const updateExercise = (db: DatabaseSync, id: number, input: UpdateExerciseInput): boolean => {
  if (Object.keys(input).length === 0) {
    return false
  }

  const fields: string[] = []
  const values: Array<string | number> = []

  if (input.slug !== undefined) {
    fields.push('slug = ?')
    values.push(input.slug.trim())
  }
  if (input.name !== undefined) {
    fields.push('name = ?')
    values.push(input.name.trim())
  }
  if (input.description !== undefined) {
    fields.push('description = ?')
    values.push(input.description.trim())
  }
  if (input.detectorKey !== undefined) {
    fields.push('detector_key = ?')
    values.push(input.detectorKey.trim())
  }
  if (input.voiceAliasesJson !== undefined) {
    fields.push('voice_aliases_json = ?')
    values.push(input.voiceAliasesJson)
  }
  if (input.sortOrder !== undefined) {
    fields.push('sort_order = ?')
    values.push(input.sortOrder)
  }
  if (input.isActive !== undefined) {
    fields.push('is_active = ?')
    values.push(input.isActive ? 1 : 0)
  }

  fields.push('updated_at = ?')
  values.push(new Date().toISOString())
  values.push(id)

  const stmt = db.prepare(`UPDATE exercises SET ${fields.join(', ')} WHERE id = ?`)
  const result = stmt.run(...values)
  return Number(result.changes) > 0
}

export const archiveExercise = (db: DatabaseSync, id: number): boolean => {
  const stmt = db.prepare(`
    UPDATE exercises
    SET is_active = 0, updated_at = ?
    WHERE id = ?
  `)
  const result = stmt.run(new Date().toISOString(), id)
  return Number(result.changes) > 0
}

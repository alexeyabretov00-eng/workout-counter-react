import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

import { EXERCISE_SEEDS } from './types.js'

const ensureUsersSchema = (db: DatabaseSync): void => {
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

  const userColumns = db.prepare('PRAGMA table_info(users)').all() as Array<{ name: string }>
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
}

const ensureExercisesSchema = (db: DatabaseSync): void => {
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
}

const ensureExerciseSetsSchema = (db: DatabaseSync): void => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS workout_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6),
      user_id INTEGER NOT NULL,
      created_by_user_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(created_by_user_id) REFERENCES users(id)
    );
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS workout_set_exercises (
      workout_set_id INTEGER NOT NULL,
      exercise_id INTEGER NOT NULL,
      sort_order INTEGER NOT NULL,
      PRIMARY KEY (workout_set_id, exercise_id),
      FOREIGN KEY(workout_set_id) REFERENCES workout_sets(id) ON DELETE CASCADE,
      FOREIGN KEY(exercise_id) REFERENCES exercises(id)
    );
  `)
}

const seedExercises = (db: DatabaseSync): void => {
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
}

export const openDatabase = (filePath: string): DatabaseSync => {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const db = new DatabaseSync(filePath)
  ensureUsersSchema(db)
  ensureExercisesSchema(db)
  ensureExerciseSetsSchema(db)
  seedExercises(db)
  db.exec('PRAGMA journal_mode = WAL;')
  return db
}

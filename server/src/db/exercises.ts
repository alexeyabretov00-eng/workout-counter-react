import type { DatabaseSync } from 'node:sqlite'

import type { CreateExerciseInput, ExerciseRow, UpdateExerciseInput } from './types.js'

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

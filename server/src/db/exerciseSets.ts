import type { DatabaseSync } from 'node:sqlite'

import type { CreateExerciseSetInput, ExerciseSetExerciseRow, ExerciseSetRow } from './types.js'

export type ExerciseSetListRow = ExerciseSetRow & {
  exercise_ids: string
  user_login: string
  created_by_login: string
}

export const listExerciseSets = (db: DatabaseSync): ExerciseSetListRow[] => {
  const stmt = db.prepare(`
    SELECT
      ws.id,
      ws.name,
      ws.day_of_week,
      ws.user_id,
      ws.created_by_user_id,
      ws.created_at,
      u.login AS user_login,
      cu.login AS created_by_login,
      COALESCE(json_group_array(wse.exercise_id), '[]') AS exercise_ids
    FROM workout_sets ws
    INNER JOIN users u ON u.id = ws.user_id
    INNER JOIN users cu ON cu.id = ws.created_by_user_id
    LEFT JOIN workout_set_exercises wse ON ws.id = wse.workout_set_id
    GROUP BY ws.id
    ORDER BY ws.created_at DESC, ws.id DESC
  `)

  return stmt.all() as ExerciseSetListRow[]
}

export const findExerciseSetById = (db: DatabaseSync, id: number): ExerciseSetListRow | undefined => {
  const stmt = db.prepare(`
    SELECT
      ws.id,
      ws.name,
      ws.day_of_week,
      ws.user_id,
      ws.created_by_user_id,
      ws.created_at,
      u.login AS user_login,
      cu.login AS created_by_login,
      COALESCE(json_group_array(wse.exercise_id), '[]') AS exercise_ids
    FROM workout_sets ws
    INNER JOIN users u ON u.id = ws.user_id
    INNER JOIN users cu ON cu.id = ws.created_by_user_id
    LEFT JOIN workout_set_exercises wse ON ws.id = wse.workout_set_id
    WHERE ws.id = ?
    GROUP BY ws.id
  `)
  return stmt.get(id) as ExerciseSetListRow | undefined
}

export const createExerciseSet = (db: DatabaseSync, input: CreateExerciseSetInput): number => {
  const nowIso = new Date().toISOString()
  const insertSetStmt = db.prepare(`
    INSERT INTO workout_sets (name, day_of_week, user_id, created_by_user_id, created_at)
    VALUES (?, ?, ?, ?, ?)
  `)
  const insertExerciseStmt = db.prepare(`
    INSERT INTO workout_set_exercises (workout_set_id, exercise_id, sort_order)
    VALUES (?, ?, ?)
  `)

  db.exec('BEGIN')
  try {
    const setResult = insertSetStmt.run(
      input.name.trim(),
      input.dayOfWeek,
      input.userId,
      input.createdByUserId,
      nowIso,
    )
    const exerciseSetId = Number(setResult.lastInsertRowid)

    input.exerciseIds.forEach((exerciseId, index) => {
      insertExerciseStmt.run(exerciseSetId, exerciseId, index)
    })

    db.exec('COMMIT')
    return exerciseSetId
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

export const updateExerciseSet = (
  db: DatabaseSync,
  id: number,
  input: CreateExerciseSetInput,
): boolean => {
  const updateSetStmt = db.prepare(`
    UPDATE workout_sets
    SET name = ?, day_of_week = ?, user_id = ?
    WHERE id = ?
  `)
  const deleteExercisesStmt = db.prepare('DELETE FROM workout_set_exercises WHERE workout_set_id = ?')
  const insertExerciseStmt = db.prepare(`
    INSERT INTO workout_set_exercises (workout_set_id, exercise_id, sort_order)
    VALUES (?, ?, ?)
  `)

  db.exec('BEGIN')
  try {
    const updateResult = updateSetStmt.run(input.name.trim(), input.dayOfWeek, input.userId, id)
    if (Number(updateResult.changes) === 0) {
      db.exec('ROLLBACK')
      return false
    }

    deleteExercisesStmt.run(id)
    input.exerciseIds.forEach((exerciseId, index) => {
      insertExerciseStmt.run(id, exerciseId, index)
    })

    db.exec('COMMIT')
    return true
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

export const deleteExerciseSet = (db: DatabaseSync, id: number): boolean => {
  const deleteExercisesStmt = db.prepare('DELETE FROM workout_set_exercises WHERE workout_set_id = ?')
  const deleteSetStmt = db.prepare('DELETE FROM workout_sets WHERE id = ?')

  db.exec('BEGIN')
  try {
    deleteExercisesStmt.run(id)
    const deleteResult = deleteSetStmt.run(id)
    db.exec('COMMIT')
    return Number(deleteResult.changes) > 0
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}

export const listExerciseSetExercises = (db: DatabaseSync, exerciseSetId: number): ExerciseSetExerciseRow[] => {
  const stmt = db.prepare(`
    SELECT workout_set_id, exercise_id, sort_order
    FROM workout_set_exercises
    WHERE workout_set_id = ?
    ORDER BY sort_order ASC, exercise_id ASC
  `)
  return stmt.all(exerciseSetId) as ExerciseSetExerciseRow[]
}

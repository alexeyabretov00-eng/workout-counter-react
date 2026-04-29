import type { DatabaseSync } from 'node:sqlite'

import express from 'express'

import { buildExerciseResponse } from '../apiResponses.js'
import { listExercises } from '../db.js'

export const createPublicRouter = (db: DatabaseSync): express.Router => {
  const router = express.Router()

  router.get('/health', (_req, res) => {
    res.status(200).json({ ok: true })
  })

  router.get('/exercises', (_req, res) => {
    const exercises = listExercises(db)
      .filter((exercise) => exercise.is_active === 1)
      .map(buildExerciseResponse)
    res.status(200).json({ exercises })
  })

  return router
}

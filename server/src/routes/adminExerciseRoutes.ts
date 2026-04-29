import type { DatabaseSync } from 'node:sqlite'

import express from 'express'

import { buildExerciseResponse } from '../apiResponses.js'
import {
  archiveExercise,
  createExercise,
  findExerciseById,
  listExercises,
  updateExercise,
} from '../db.js'
import { sendError } from '../httpErrors.js'
import { validateCreateExerciseInput, validateUpdateExerciseInput } from '../validation.js'

import { requireAuthorizedUser } from './guards.js'

export const createAdminExerciseRouter = (db: DatabaseSync, jwtSecret: string): express.Router => {
  const router = express.Router()

  router.post('/admin/exercises', (req, res) => {
    const user = requireAuthorizedUser(db, jwtSecret, req, res, ['admin', 'superadmin'])
    if (!user) {
      return
    }

    const parsed = validateCreateExerciseInput(req.body)
    if (Array.isArray(parsed)) {
      const message = parsed.map((issue) => issue.message).join(' ')
      sendError(res, 400, 'VALIDATION_ERROR', message)
      return
    }

    try {
      const id = createExercise(db, {
        slug: parsed.slug,
        name: parsed.name,
        description: parsed.description,
        detectorKey: parsed.detectorKey,
        voiceAliasesJson: JSON.stringify(parsed.voiceAliases),
        sortOrder: parsed.sortOrder,
        isActive: parsed.isActive,
      })
      const exercise = findExerciseById(db, id)
      if (!exercise) {
        sendError(res, 500, 'INTERNAL', 'Не удалось прочитать созданное упражнение.')
        return
      }
      res.status(201).json({ exercise: buildExerciseResponse(exercise) })
    } catch (error: unknown) {
      const errcode =
        typeof error === 'object' && error !== null && 'errcode' in error
          ? (error as { errcode?: number }).errcode
          : undefined
      const message = error instanceof Error ? error.message : ''
      if (errcode === 2067 || message.includes('UNIQUE')) {
        sendError(res, 409, 'EXERCISE_CONFLICT', 'Упражнение с таким slug уже существует.')
        return
      }
      sendError(res, 500, 'INTERNAL', 'Не удалось создать упражнение.')
    }
  })

  router.get('/admin/exercises', (req, res) => {
    const user = requireAuthorizedUser(db, jwtSecret, req, res, ['admin', 'superadmin'])
    if (!user) {
      return
    }

    const exercises = listExercises(db).map(buildExerciseResponse)
    res.status(200).json({ exercises })
  })

  router.patch('/admin/exercises/:id', (req, res) => {
    const user = requireAuthorizedUser(db, jwtSecret, req, res, ['admin', 'superadmin'])
    if (!user) {
      return
    }

    const id = Number.parseInt(req.params.id, 10)
    if (!Number.isInteger(id) || id <= 0) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Некорректный id упражнения.')
      return
    }

    const parsed = validateUpdateExerciseInput(req.body)
    if (Array.isArray(parsed)) {
      const message = parsed.map((issue) => issue.message).join(' ')
      sendError(res, 400, 'VALIDATION_ERROR', message)
      return
    }

    try {
      const changed = updateExercise(db, id, {
        slug: parsed.slug,
        name: parsed.name,
        description: parsed.description,
        detectorKey: parsed.detectorKey,
        voiceAliasesJson:
          parsed.voiceAliases !== undefined ? JSON.stringify(parsed.voiceAliases) : undefined,
        sortOrder: parsed.sortOrder,
        isActive: parsed.isActive,
      })
      if (!changed) {
        sendError(res, 404, 'NOT_FOUND', 'Упражнение не найдено.')
        return
      }
      const exercise = findExerciseById(db, id)
      if (!exercise) {
        sendError(res, 404, 'NOT_FOUND', 'Упражнение не найдено.')
        return
      }
      res.status(200).json({ exercise: buildExerciseResponse(exercise) })
    } catch (error: unknown) {
      const errcode =
        typeof error === 'object' && error !== null && 'errcode' in error
          ? (error as { errcode?: number }).errcode
          : undefined
      const message = error instanceof Error ? error.message : ''
      if (errcode === 2067 || message.includes('UNIQUE')) {
        sendError(res, 409, 'EXERCISE_CONFLICT', 'Упражнение с таким slug уже существует.')
        return
      }
      sendError(res, 500, 'INTERNAL', 'Не удалось обновить упражнение.')
    }
  })

  router.delete('/admin/exercises/:id', (req, res) => {
    const user = requireAuthorizedUser(db, jwtSecret, req, res, ['admin', 'superadmin'])
    if (!user) {
      return
    }

    const id = Number.parseInt(req.params.id, 10)
    if (!Number.isInteger(id) || id <= 0) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Некорректный id упражнения.')
      return
    }

    const archived = archiveExercise(db, id)
    if (!archived) {
      sendError(res, 404, 'NOT_FOUND', 'Упражнение не найдено.')
      return
    }
    res.status(200).json({ ok: true })
  })

  return router
}

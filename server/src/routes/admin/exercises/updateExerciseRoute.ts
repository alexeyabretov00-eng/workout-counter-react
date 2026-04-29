import type express from 'express'

import { buildExerciseResponse } from '../../../apiResponses.js'
import { findExerciseById, updateExercise } from '../../../db.js'
import { sendError } from '../../../httpErrors.js'
import { validateUpdateExerciseInput } from '../../../validation.js'
import { requireAuthorizedUser } from '../../guards.js'

import type { AdminExerciseRouteDeps } from './types.js'

export const registerUpdateExerciseRoute = (
  router: express.Router,
  deps: AdminExerciseRouteDeps,
): void => {
  const { db, jwtSecret } = deps

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
}

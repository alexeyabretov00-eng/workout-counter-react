import type express from 'express'

import { buildExerciseResponse } from '../../../apiResponses.js'
import { createExercise, findExerciseById } from '../../../db.js'
import { sendError } from '../../../httpErrors.js'
import { validateCreateExerciseInput } from '../../../validation.js'
import { requireAuthorizedUser } from '../../guards.js'

import type { AdminExerciseRouteDeps } from './types.js'

export const registerCreateExerciseRoute = (
  router: express.Router,
  deps: AdminExerciseRouteDeps,
): void => {
  const { db, jwtSecret } = deps

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
}

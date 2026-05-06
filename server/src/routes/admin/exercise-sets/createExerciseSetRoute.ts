import type express from 'express'

import { buildExerciseSetResponse } from '../../../apiResponses.js'
import { createExerciseSet, findExerciseById, findUserById, listExerciseSets } from '../../../db.js'
import { sendError } from '../../../httpErrors.js'
import { validateCreateExerciseSetInput } from '../../../validation/index.js'
import { requireAuthenticatedUser } from '../../guards.js'

import type { AdminExerciseSetRouteDeps } from './types.js'

export const registerCreateExerciseSetRoute = (
  router: express.Router,
  deps: AdminExerciseSetRouteDeps,
): void => {
  const { db, jwtSecret } = deps

  router.post('/admin/exercise-sets', (req, res) => {
    const user = requireAuthenticatedUser(db, jwtSecret, req, res)
    if (!user) {
      return
    }

    const parsed = validateCreateExerciseSetInput(req.body)
    if (Array.isArray(parsed)) {
      const message = parsed.map((issue) => issue.message).join(' ')
      sendError(res, 400, 'VALIDATION_ERROR', message)
      return
    }

    const resolvedUserId =
      user.role === 'admin' || user.role === 'superadmin' ? (parsed.userId ?? user.id) : user.id
    if (user.role === 'user' && parsed.userId !== undefined && parsed.userId !== user.id) {
      sendError(
        res,
        403,
        'FORBIDDEN',
        'Пользователь с ролью user не может назначать сет другому пользователю.',
      )
      return
    }

    const targetUser = findUserById(db, resolvedUserId)
    if (!targetUser) {
      sendError(res, 404, 'USER_NOT_FOUND', 'Пользователь для привязки сета не найден.')
      return
    }

    const missingExerciseId = parsed.exerciseIds.find((exerciseId) => !findExerciseById(db, exerciseId))
    if (missingExerciseId) {
      sendError(
        res,
        404,
        'EXERCISE_NOT_FOUND',
        `Упражнение с id=${String(missingExerciseId)} не найдено.`,
      )
      return
    }

    try {
      const createdId = createExerciseSet(db, {
        name: parsed.name,
        dayOfWeek: parsed.dayOfWeek,
        exerciseIds: parsed.exerciseIds,
        userId: resolvedUserId,
        createdByUserId: user.id,
      })
      const created = listExerciseSets(db).find((set) => set.id === createdId)
      if (!created) {
        sendError(res, 500, 'INTERNAL', 'Не удалось прочитать созданный сет.')
        return
      }
      res.status(201).json({ set: buildExerciseSetResponse(created) })
    } catch (error) {
      console.error('Failed to create exercise set', error)
      sendError(res, 500, 'INTERNAL', 'Не удалось создать сет упражнений.')
    }
  })
}

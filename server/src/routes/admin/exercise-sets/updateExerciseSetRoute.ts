import type express from 'express'

import { buildExerciseSetResponse } from '../../../apiResponses.js'
import { findExerciseById, findExerciseSetById, findUserById, updateExerciseSet } from '../../../db.js'
import { sendError } from '../../../httpErrors.js'
import { validateUpdateExerciseSetInput } from '../../../validation/index.js'
import { requireAuthenticatedUser } from '../../guards.js'

import type { AdminExerciseSetRouteDeps } from './types.js'

export const registerUpdateExerciseSetRoute = (
  router: express.Router,
  deps: AdminExerciseSetRouteDeps,
): void => {
  const { db, jwtSecret } = deps

  router.patch('/admin/exercise-sets/:id', (req, res) => {
    const user = requireAuthenticatedUser(db, jwtSecret, req, res)
    if (!user) {
      return
    }

    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      sendError(res, 400, 'VALIDATION_ERROR', 'Некорректный id сета.')
      return
    }

    const existingSet = findExerciseSetById(db, id)
    if (!existingSet) {
      sendError(res, 404, 'WORKOUT_SET_NOT_FOUND', 'Сет не найден.')
      return
    }
    if (user.role === 'user' && existingSet.user_id !== user.id) {
      sendError(res, 403, 'FORBIDDEN', 'Недостаточно прав для редактирования чужого сета.')
      return
    }

    const parsed = validateUpdateExerciseSetInput(req.body)
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
      const updated = updateExerciseSet(db, id, {
        name: parsed.name,
        dayOfWeek: parsed.dayOfWeek,
        exerciseIds: parsed.exerciseIds,
        userId: resolvedUserId,
        createdByUserId: existingSet.created_by_user_id,
      })
      if (!updated) {
        sendError(res, 404, 'WORKOUT_SET_NOT_FOUND', 'Сет не найден.')
        return
      }

      const set = findExerciseSetById(db, id)
      if (!set) {
        sendError(res, 500, 'INTERNAL', 'Не удалось прочитать обновленный сет.')
        return
      }
      res.status(200).json({ set: buildExerciseSetResponse(set) })
    } catch (error) {
      console.error('Failed to update exercise set', error)
      sendError(res, 500, 'INTERNAL', 'Не удалось обновить сет упражнений.')
    }
  })
}

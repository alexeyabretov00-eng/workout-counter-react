import type express from 'express'

import { deleteExerciseSet, findExerciseSetById } from '../../../db.js'
import { sendError } from '../../../httpErrors.js'
import { requireAuthenticatedUser } from '../../guards.js'

import type { AdminExerciseSetRouteDeps } from './types.js'

export const registerDeleteExerciseSetRoute = (
  router: express.Router,
  deps: AdminExerciseSetRouteDeps,
): void => {
  const { db, jwtSecret } = deps

  router.delete('/admin/exercise-sets/:id', (req, res) => {
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
      sendError(res, 403, 'FORBIDDEN', 'Недостаточно прав для удаления чужого сета.')
      return
    }

    try {
      const deleted = deleteExerciseSet(db, id)
      if (!deleted) {
        sendError(res, 404, 'WORKOUT_SET_NOT_FOUND', 'Сет не найден.')
        return
      }
      res.status(200).json({ ok: true })
    } catch (error) {
      console.error('Failed to delete exercise set', error)
      sendError(res, 500, 'INTERNAL', 'Не удалось удалить сет упражнений.')
    }
  })
}

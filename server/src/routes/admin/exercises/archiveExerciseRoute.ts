import type express from 'express'

import { archiveExercise } from '../../../db.js'
import { sendError } from '../../../httpErrors.js'
import { requireAuthorizedUser } from '../../guards.js'

import type { AdminExerciseRouteDeps } from './types.js'

export const registerArchiveExerciseRoute = (
  router: express.Router,
  deps: AdminExerciseRouteDeps,
): void => {
  const { db, jwtSecret } = deps

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
}

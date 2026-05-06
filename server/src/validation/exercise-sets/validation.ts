import type { ExerciseSetInput, ExerciseSetValidationIssue } from './types.js'

const MAX_SET_NAME_LENGTH = 120

export const validateCreateExerciseSetInput = (
  payload: unknown,
): ExerciseSetInput | ExerciseSetValidationIssue[] => {
  const issues: ExerciseSetValidationIssue[] = []
  if (!payload || typeof payload !== 'object') {
    return [{ field: 'name', message: 'Тело запроса должно быть объектом.' }]
  }

  const data = payload as Record<string, unknown>
  const nameRaw = data.name
  const dayOfWeekRaw = data.dayOfWeek
  const exerciseIdsRaw = data.exerciseIds
  const userIdRaw = data.userId

  const name = typeof nameRaw === 'string' ? nameRaw.trim() : ''
  if (!name || name.length > MAX_SET_NAME_LENGTH) {
    issues.push({
      field: 'name',
      message: `Название сета обязательно и должно быть не длиннее ${String(MAX_SET_NAME_LENGTH)} символов.`,
    })
  }

  const dayOfWeek =
    Number.isInteger(dayOfWeekRaw) && Number(dayOfWeekRaw) >= 0 && Number(dayOfWeekRaw) <= 6
      ? (Number(dayOfWeekRaw) as ExerciseSetInput['dayOfWeek'])
      : null
  if (dayOfWeek === null) {
    issues.push({ field: 'dayOfWeek', message: 'dayOfWeek должен быть целым числом от 0 до 6.' })
  }

  const exerciseIds = Array.isArray(exerciseIdsRaw)
    ? exerciseIdsRaw.filter((value): value is number => Number.isInteger(value) && value > 0)
    : []
  if (!Array.isArray(exerciseIdsRaw) || exerciseIds.length === 0) {
    issues.push({
      field: 'exerciseIds',
      message: 'exerciseIds должен содержать хотя бы один id упражнения.',
    })
  }
  if (exerciseIds.length !== new Set(exerciseIds).size) {
    issues.push({ field: 'exerciseIds', message: 'exerciseIds не должен содержать дубликатов.' })
  }

  let userId: number | undefined
  if (userIdRaw !== undefined) {
    if (!Number.isInteger(userIdRaw) || Number(userIdRaw) <= 0) {
      issues.push({ field: 'userId', message: 'userId должен быть положительным целым числом.' })
    } else {
      userId = Number(userIdRaw)
    }
  }

  if (issues.length > 0 || dayOfWeek === null) {
    return issues
  }

  return { name, dayOfWeek, exerciseIds, userId }
}

export const validateUpdateExerciseSetInput = (
  payload: unknown,
): ExerciseSetInput | ExerciseSetValidationIssue[] => {
  return validateCreateExerciseSetInput(payload)
}

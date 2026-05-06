import {
  DETECTOR_KEY_PATTERN,
  EXERCISE_VALIDATION_MESSAGES,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MAX_SLUG_LENGTH,
  SLUG_PATTERN,
} from './constants.js'
import {
  normalizeBooleanField,
  normalizeKebabCaseField,
  normalizeSortOrder,
  normalizeStringField,
  parseVoiceAliases,
  pushIssue,
} from './helpers.js'
import type { ExerciseInput, ExerciseValidationIssue } from './types.js'

export const validateUpdateExerciseInput = (
  payload: unknown,
): Partial<ExerciseInput> | ExerciseValidationIssue[] => {
  if (!payload || typeof payload !== 'object') {
    return [{ field: 'slug', message: EXERCISE_VALIDATION_MESSAGES.payloadMustBeObject }]
  }

  const data = payload as Record<string, unknown>
  const keys = Object.keys(data)
  if (keys.length === 0) {
    return [{ field: 'slug', message: EXERCISE_VALIDATION_MESSAGES.updateAtLeastOneField }]
  }

  const normalized: Partial<ExerciseInput> = {}
  const issues: ExerciseValidationIssue[] = []

  if ('slug' in data) {
    const value = normalizeKebabCaseField(data.slug, MAX_SLUG_LENGTH, SLUG_PATTERN)
    if (!value) {
      pushIssue(issues, 'slug', EXERCISE_VALIDATION_MESSAGES.slugInvalid)
    } else {
      normalized.slug = value
    }
  }

  if ('name' in data) {
    const value = normalizeStringField(data.name, MAX_NAME_LENGTH)
    if (!value) {
      pushIssue(issues, 'name', EXERCISE_VALIDATION_MESSAGES.nameInvalid)
    } else {
      normalized.name = value
    }
  }

  if ('description' in data) {
    const value = normalizeStringField(data.description, MAX_DESCRIPTION_LENGTH)
    if (!value) {
      pushIssue(issues, 'description', EXERCISE_VALIDATION_MESSAGES.descriptionInvalid)
    } else {
      normalized.description = value
    }
  }

  if ('detectorKey' in data) {
    const value = normalizeKebabCaseField(data.detectorKey, MAX_SLUG_LENGTH, DETECTOR_KEY_PATTERN)
    if (!value) {
      pushIssue(issues, 'detectorKey', EXERCISE_VALIDATION_MESSAGES.detectorKeyInvalid)
    } else {
      normalized.detectorKey = value
    }
  }

  if ('voiceAliases' in data) {
    const value = parseVoiceAliases(data.voiceAliases, issues)
    if (value !== null) {
      normalized.voiceAliases = value
    }
  }

  if ('sortOrder' in data) {
    const value = normalizeSortOrder(data.sortOrder)
    if (value === null) {
      pushIssue(issues, 'sortOrder', EXERCISE_VALIDATION_MESSAGES.sortOrderInvalid)
    } else {
      normalized.sortOrder = value
    }
  }

  if ('isActive' in data) {
    const value = normalizeBooleanField(data.isActive)
    if (value === null) {
      pushIssue(issues, 'isActive', EXERCISE_VALIDATION_MESSAGES.isActiveInvalid)
    } else {
      normalized.isActive = value
    }
  }

  if (issues.length > 0) {
    return issues
  }

  if (Object.keys(normalized).length === 0) {
    return [{ field: 'slug', message: EXERCISE_VALIDATION_MESSAGES.noValidFieldsToUpdate }]
  }

  return normalized
}

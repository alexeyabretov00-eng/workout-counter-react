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

export const validateCreateExerciseInput = (
  payload: unknown,
): ExerciseInput | ExerciseValidationIssue[] => {
  const issues: ExerciseValidationIssue[] = []
  if (!payload || typeof payload !== 'object') {
    return [{ field: 'slug', message: EXERCISE_VALIDATION_MESSAGES.payloadMustBeObject }]
  }

  const data = payload as Record<string, unknown>

  const slugRaw = data.slug
  const nameRaw = data.name
  const descriptionRaw = data.description
  const detectorKeyRaw = data.detectorKey
  const voiceAliasesRaw = data.voiceAliases
  const sortOrderRaw = data.sortOrder
  const isActiveRaw = data.isActive

  const slug = normalizeKebabCaseField(slugRaw, MAX_SLUG_LENGTH, SLUG_PATTERN)
  if (!slug) {
    pushIssue(issues, 'slug', EXERCISE_VALIDATION_MESSAGES.slugInvalid)
  }

  const name = normalizeStringField(nameRaw, MAX_NAME_LENGTH)
  if (!name) {
    pushIssue(issues, 'name', EXERCISE_VALIDATION_MESSAGES.nameInvalid)
  }

  const description = normalizeStringField(descriptionRaw, MAX_DESCRIPTION_LENGTH)
  if (!description) {
    pushIssue(issues, 'description', EXERCISE_VALIDATION_MESSAGES.descriptionInvalid)
  }

  const detectorKey = normalizeKebabCaseField(detectorKeyRaw, MAX_SLUG_LENGTH, DETECTOR_KEY_PATTERN)
  if (!detectorKey) {
    pushIssue(issues, 'detectorKey', EXERCISE_VALIDATION_MESSAGES.detectorKeyInvalid)
  }

  const voiceAliases = parseVoiceAliases(voiceAliasesRaw, issues)

  const sortOrder = normalizeSortOrder(sortOrderRaw)
  if (sortOrder === null) {
    pushIssue(issues, 'sortOrder', EXERCISE_VALIDATION_MESSAGES.sortOrderInvalid)
  }

  const isActive = normalizeBooleanField(isActiveRaw)
  if (isActive === null) {
    pushIssue(issues, 'isActive', EXERCISE_VALIDATION_MESSAGES.isActiveInvalid)
  }

  if (
    issues.length > 0 ||
    !slug ||
    !name ||
    !description ||
    !detectorKey ||
    voiceAliases === null ||
    sortOrder === null ||
    isActive === null
  ) {
    return issues
  }

  return {
    slug,
    name,
    description,
    detectorKey,
    voiceAliases,
    sortOrder,
    isActive,
  }
}

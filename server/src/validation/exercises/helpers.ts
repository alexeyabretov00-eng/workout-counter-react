import {
  EXERCISE_VALIDATION_MESSAGES,
  MAX_ALIAS_LENGTH,
  MAX_SORT_ORDER,
  MAX_VOICE_ALIASES,
  MIN_SORT_ORDER,
  MIN_TEXT_LENGTH,
} from './constants.js'
import type { ExerciseInput, ExerciseValidationIssue } from './types.js'

export const pushIssue = (
  issues: ExerciseValidationIssue[],
  field: keyof ExerciseInput,
  message: string,
): void => {
  issues.push({ field, message })
}

export const normalizeStringField = (value: unknown, maxLength: number): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  if (trimmed.length < MIN_TEXT_LENGTH || trimmed.length > maxLength) {
    return null
  }

  return trimmed
}

export const normalizeKebabCaseField = (
  value: unknown,
  maxLength: number,
  pattern: RegExp,
): string | null => {
  const normalized = normalizeStringField(value, maxLength)
  if (!normalized || !pattern.test(normalized)) {
    return null
  }

  return normalized
}

export const normalizeSortOrder = (value: unknown): number | null => {
  if (
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value < MIN_SORT_ORDER ||
    value > MAX_SORT_ORDER
  ) {
    return null
  }

  return value
}

export const normalizeBooleanField = (value: unknown): boolean | null => {
  if (typeof value !== 'boolean') {
    return null
  }

  return value
}

export const parseVoiceAliases = (value: unknown, issues: ExerciseValidationIssue[]): string[] | null => {
  if (!Array.isArray(value)) {
    pushIssue(issues, 'voiceAliases', EXERCISE_VALIDATION_MESSAGES.voiceAliasesMustBeArray)
    return null
  }

  if (value.length > MAX_VOICE_ALIASES) {
    pushIssue(issues, 'voiceAliases', EXERCISE_VALIDATION_MESSAGES.voiceAliasesTooMany)
  }

  const normalized: string[] = []
  for (const item of value) {
    if (typeof item !== 'string') {
      pushIssue(issues, 'voiceAliases', EXERCISE_VALIDATION_MESSAGES.voiceAliasMustBeString)
      continue
    }

    const trimmed = item.trim()
    if (trimmed.length === 0 || trimmed.length > MAX_ALIAS_LENGTH) {
      pushIssue(issues, 'voiceAliases', EXERCISE_VALIDATION_MESSAGES.voiceAliasLengthInvalid)
      continue
    }

    normalized.push(trimmed)
  }

  return normalized
}

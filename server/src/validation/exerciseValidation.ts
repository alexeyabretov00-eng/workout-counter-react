import type { ExerciseInput, ExerciseValidationIssue } from './types.js'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DETECTOR_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const MIN_TEXT_LENGTH = 1
const MAX_SLUG_LENGTH = 64
const MAX_NAME_LENGTH = 120
const MAX_DESCRIPTION_LENGTH = 500
const MAX_VOICE_ALIASES = 30
const MAX_ALIAS_LENGTH = 80
const MIN_SORT_ORDER = 0
const MAX_SORT_ORDER = 10000

const parseVoiceAliases = (
  value: unknown,
  issues: ExerciseValidationIssue[],
): string[] | null => {
  if (!Array.isArray(value)) {
    issues.push({
      field: 'voiceAliases',
      message: 'voiceAliases должен быть массивом строк.',
    })
    return null
  }

  if (value.length > MAX_VOICE_ALIASES) {
    issues.push({
      field: 'voiceAliases',
      message: `Допустимо не более ${MAX_VOICE_ALIASES} голосовых алиасов.`,
    })
  }

  const normalized: string[] = []
  for (const item of value) {
    if (typeof item !== 'string') {
      issues.push({
        field: 'voiceAliases',
        message: 'Каждый алиас должен быть строкой.',
      })
      continue
    }
    const trimmed = item.trim()
    if (trimmed.length === 0 || trimmed.length > MAX_ALIAS_LENGTH) {
      issues.push({
        field: 'voiceAliases',
        message: `Каждый алиас должен быть от 1 до ${MAX_ALIAS_LENGTH} символов.`,
      })
      continue
    }
    normalized.push(trimmed)
  }

  return normalized
}

export const validateCreateExerciseInput = (
  payload: unknown,
): ExerciseInput | ExerciseValidationIssue[] => {
  const issues: ExerciseValidationIssue[] = []
  if (!payload || typeof payload !== 'object') {
    return [{ field: 'slug', message: 'Тело запроса должно быть объектом.' }]
  }

  const data = payload as Record<string, unknown>

  const slugRaw = data.slug
  const nameRaw = data.name
  const descriptionRaw = data.description
  const detectorKeyRaw = data.detectorKey
  const voiceAliasesRaw = data.voiceAliases
  const sortOrderRaw = data.sortOrder
  const isActiveRaw = data.isActive

  const slug = typeof slugRaw === 'string' ? slugRaw.trim() : ''
  if (
    slug.length < MIN_TEXT_LENGTH ||
    slug.length > MAX_SLUG_LENGTH ||
    !SLUG_PATTERN.test(slug)
  ) {
    issues.push({
      field: 'slug',
      message: 'slug: lowercase kebab-case, от 1 до 64 символов.',
    })
  }

  const name = typeof nameRaw === 'string' ? nameRaw.trim() : ''
  if (name.length < MIN_TEXT_LENGTH || name.length > MAX_NAME_LENGTH) {
    issues.push({
      field: 'name',
      message: `name: от ${MIN_TEXT_LENGTH} до ${MAX_NAME_LENGTH} символов.`,
    })
  }

  const description = typeof descriptionRaw === 'string' ? descriptionRaw.trim() : ''
  if (
    description.length < MIN_TEXT_LENGTH ||
    description.length > MAX_DESCRIPTION_LENGTH
  ) {
    issues.push({
      field: 'description',
      message: `description: от ${MIN_TEXT_LENGTH} до ${MAX_DESCRIPTION_LENGTH} символов.`,
    })
  }

  const detectorKey = typeof detectorKeyRaw === 'string' ? detectorKeyRaw.trim() : ''
  if (
    detectorKey.length < MIN_TEXT_LENGTH ||
    detectorKey.length > MAX_SLUG_LENGTH ||
    !DETECTOR_KEY_PATTERN.test(detectorKey)
  ) {
    issues.push({
      field: 'detectorKey',
      message: 'detectorKey: lowercase kebab-case, от 1 до 64 символов.',
    })
  }

  const voiceAliases = parseVoiceAliases(voiceAliasesRaw, issues)

  if (
    typeof sortOrderRaw !== 'number' ||
    !Number.isInteger(sortOrderRaw) ||
    sortOrderRaw < MIN_SORT_ORDER ||
    sortOrderRaw > MAX_SORT_ORDER
  ) {
    issues.push({
      field: 'sortOrder',
      message: `sortOrder: целое число от ${MIN_SORT_ORDER} до ${MAX_SORT_ORDER}.`,
    })
  }

  if (typeof isActiveRaw !== 'boolean') {
    issues.push({
      field: 'isActive',
      message: 'isActive должен быть boolean.',
    })
  }

  if (issues.length > 0 || voiceAliases === null) {
    return issues
  }

  const sortOrder = sortOrderRaw as number
  const isActive = isActiveRaw as boolean

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

export const validateUpdateExerciseInput = (
  payload: unknown,
): Partial<ExerciseInput> | ExerciseValidationIssue[] => {
  if (!payload || typeof payload !== 'object') {
    return [{ field: 'slug', message: 'Тело запроса должно быть объектом.' }]
  }

  const data = payload as Record<string, unknown>
  const keys = Object.keys(data)
  if (keys.length === 0) {
    return [{ field: 'slug', message: 'Передайте хотя бы одно поле для обновления.' }]
  }

  const normalized: Partial<ExerciseInput> = {}
  const issues: ExerciseValidationIssue[] = []

  if ('slug' in data) {
    const value = typeof data.slug === 'string' ? data.slug.trim() : ''
    if (
      value.length < MIN_TEXT_LENGTH ||
      value.length > MAX_SLUG_LENGTH ||
      !SLUG_PATTERN.test(value)
    ) {
      issues.push({
        field: 'slug',
        message: 'slug: lowercase kebab-case, от 1 до 64 символов.',
      })
    } else {
      normalized.slug = value
    }
  }

  if ('name' in data) {
    const value = typeof data.name === 'string' ? data.name.trim() : ''
    if (value.length < MIN_TEXT_LENGTH || value.length > MAX_NAME_LENGTH) {
      issues.push({
        field: 'name',
        message: `name: от ${MIN_TEXT_LENGTH} до ${MAX_NAME_LENGTH} символов.`,
      })
    } else {
      normalized.name = value
    }
  }

  if ('description' in data) {
    const value = typeof data.description === 'string' ? data.description.trim() : ''
    if (value.length < MIN_TEXT_LENGTH || value.length > MAX_DESCRIPTION_LENGTH) {
      issues.push({
        field: 'description',
        message: `description: от ${MIN_TEXT_LENGTH} до ${MAX_DESCRIPTION_LENGTH} символов.`,
      })
    } else {
      normalized.description = value
    }
  }

  if ('detectorKey' in data) {
    const value = typeof data.detectorKey === 'string' ? data.detectorKey.trim() : ''
    if (
      value.length < MIN_TEXT_LENGTH ||
      value.length > MAX_SLUG_LENGTH ||
      !DETECTOR_KEY_PATTERN.test(value)
    ) {
      issues.push({
        field: 'detectorKey',
        message: 'detectorKey: lowercase kebab-case, от 1 до 64 символов.',
      })
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
    const value = data.sortOrder
    if (
      typeof value !== 'number' ||
      !Number.isInteger(value) ||
      value < MIN_SORT_ORDER ||
      value > MAX_SORT_ORDER
    ) {
      issues.push({
        field: 'sortOrder',
        message: `sortOrder: целое число от ${MIN_SORT_ORDER} до ${MAX_SORT_ORDER}.`,
      })
    } else {
      normalized.sortOrder = value
    }
  }

  if ('isActive' in data) {
    const value = data.isActive
    if (typeof value !== 'boolean') {
      issues.push({
        field: 'isActive',
        message: 'isActive должен быть boolean.',
      })
    } else {
      normalized.isActive = value
    }
  }

  if (issues.length > 0) {
    return issues
  }

  if (Object.keys(normalized).length === 0) {
    return [{ field: 'slug', message: 'Нет валидных полей для обновления.' }]
  }

  return normalized
}

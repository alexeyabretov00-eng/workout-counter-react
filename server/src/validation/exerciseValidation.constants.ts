export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const DETECTOR_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const MIN_TEXT_LENGTH = 1
export const MAX_SLUG_LENGTH = 64
export const MAX_NAME_LENGTH = 120
export const MAX_DESCRIPTION_LENGTH = 500
export const MAX_VOICE_ALIASES = 30
export const MAX_ALIAS_LENGTH = 80
export const MIN_SORT_ORDER = 0
export const MAX_SORT_ORDER = 10000

export const EXERCISE_VALIDATION_MESSAGES = {
  payloadMustBeObject: 'Тело запроса должно быть объектом.',
  updateAtLeastOneField: 'Передайте хотя бы одно поле для обновления.',
  noValidFieldsToUpdate: 'Нет валидных полей для обновления.',
  slugInvalid: 'slug: lowercase kebab-case, от 1 до 64 символов.',
  nameInvalid: `name: от ${MIN_TEXT_LENGTH} до ${MAX_NAME_LENGTH} символов.`,
  descriptionInvalid: `description: от ${MIN_TEXT_LENGTH} до ${MAX_DESCRIPTION_LENGTH} символов.`,
  detectorKeyInvalid: 'detectorKey: lowercase kebab-case, от 1 до 64 символов.',
  sortOrderInvalid: `sortOrder: целое число от ${MIN_SORT_ORDER} до ${MAX_SORT_ORDER}.`,
  isActiveInvalid: 'isActive должен быть boolean.',
  voiceAliasesMustBeArray: 'voiceAliases должен быть массивом строк.',
  voiceAliasesTooMany: `Допустимо не более ${MAX_VOICE_ALIASES} голосовых алиасов.`,
  voiceAliasMustBeString: 'Каждый алиас должен быть строкой.',
  voiceAliasLengthInvalid: `Каждый алиас должен быть от 1 до ${MAX_ALIAS_LENGTH} символов.`,
} as const

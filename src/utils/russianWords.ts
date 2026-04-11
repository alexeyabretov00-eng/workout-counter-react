const RU_UNITS = [
  'ноль',
  'один',
  'два',
  'три',
  'четыре',
  'пять',
  'шесть',
  'семь',
  'восемь',
  'девять',
  'десять',
  'одиннадцать',
  'двенадцать',
  'тринадцать',
  'четырнадцать',
  'пятнадцать',
  'шестнадцать',
  'семнадцать',
  'восемнадцать',
  'девятнадцать',
]

const RU_TENS = [
  '',
  '',
  'двадцать',
  'тридцать',
  'сорок',
  'пятьдесят',
  'шестьдесят',
  'семьдесят',
  'восемьдесят',
  'девяносто',
]

const RU_HUNDREDS = [
  '',
  'сто',
  'двести',
  'триста',
  'четыреста',
  'пятьсот',
  'шестьсот',
  'семьсот',
  'восемьсот',
  'девятьсот',
]

export const numberToRussianWords = (value: number): string => {
  const safeValue = Math.max(0, Math.trunc(value))
  if (safeValue < 20) {
    return RU_UNITS[safeValue]
  }

  if (safeValue < 100) {
    const tens = Math.floor(safeValue / 10)
    const units = safeValue % 10
    return units > 0 ? `${RU_TENS[tens]} ${RU_UNITS[units]}` : RU_TENS[tens]
  }

  if (safeValue < 1000) {
    const hundreds = Math.floor(safeValue / 100)
    const rest = safeValue % 100
    return rest > 0
      ? `${RU_HUNDREDS[hundreds]} ${numberToRussianWords(rest)}`
      : RU_HUNDREDS[hundreds]
  }

  return String(safeValue)
}

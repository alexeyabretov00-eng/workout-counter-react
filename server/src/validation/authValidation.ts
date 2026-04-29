import type { ValidationIssue } from './types.js'

const LOGIN_MIN = 3
const LOGIN_MAX = 32
const PASSWORD_MIN = 8
const PASSWORD_MAX = 128
const LOGIN_PATTERN = /^[a-zA-Z0-9_-]+$/

export const validateCredentials = (
  login: unknown,
  password: unknown,
): { login: string; password: string } | ValidationIssue[] => {
  const issues: ValidationIssue[] = []

  if (typeof login !== 'string' || typeof password !== 'string') {
    issues.push({ field: 'login', message: 'Логин и пароль должны быть строками.' })
    if (typeof password !== 'string') {
      issues.push({ field: 'password', message: 'Пароль обязателен.' })
    }
    return issues
  }

  const trimmedLogin = login.trim()
  if (trimmedLogin.length < LOGIN_MIN || trimmedLogin.length > LOGIN_MAX) {
    issues.push({
      field: 'login',
      message: `Логин: от ${LOGIN_MIN} до ${LOGIN_MAX} символов.`,
    })
  } else if (!LOGIN_PATTERN.test(trimmedLogin)) {
    issues.push({
      field: 'login',
      message: 'Логин: только латиница, цифры, «_» и «-».',
    })
  }

  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    issues.push({
      field: 'password',
      message: `Пароль: от ${PASSWORD_MIN} до ${PASSWORD_MAX} символов.`,
    })
  }

  if (issues.length > 0) {
    return issues
  }

  return { login: trimmedLogin, password }
}

export const validatePassword = (password: unknown): string | ValidationIssue[] => {
  if (typeof password !== 'string') {
    return [{ field: 'password', message: 'Пароль обязателен.' }]
  }
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    return [
      {
        field: 'password',
        message: `Пароль: от ${PASSWORD_MIN} до ${PASSWORD_MAX} символов.`,
      },
    ]
  }
  return password
}

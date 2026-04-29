import type { UserRoleInput, ValidationIssue } from './types.js'

export const validateUserRole = (role: unknown): UserRoleInput | ValidationIssue[] => {
  if (role === 'user' || role === 'admin' || role === 'superadmin') {
    return role
  }
  return [{ field: 'login', message: 'Роль должна быть user, admin или superadmin.' }]
}

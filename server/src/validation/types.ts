export type ValidationIssue = {
  field: 'login' | 'password'
  message: string
}

export type UserRoleInput = 'user' | 'admin' | 'superadmin'

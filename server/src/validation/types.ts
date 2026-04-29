export type ValidationIssue = {
  field: 'login' | 'password'
  message: string
}

export type UserRoleInput = 'user' | 'admin' | 'superadmin'

export type ExerciseInput = {
  slug: string
  name: string
  description: string
  detectorKey: string
  voiceAliases: string[]
  sortOrder: number
  isActive: boolean
}

export type ExerciseValidationIssue = {
  field:
    | 'slug'
    | 'name'
    | 'description'
    | 'detectorKey'
    | 'voiceAliases'
    | 'sortOrder'
    | 'isActive'
  message: string
}

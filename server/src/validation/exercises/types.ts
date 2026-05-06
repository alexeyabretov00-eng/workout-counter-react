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

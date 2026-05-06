export type ExerciseSetInput = {
  name: string
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6
  exerciseIds: number[]
  userId?: number
}

export type ExerciseSetValidationIssue = {
  field: 'name' | 'dayOfWeek' | 'exerciseIds' | 'userId'
  message: string
}

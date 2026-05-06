export type UserRole = 'user' | 'admin' | 'superadmin'

export type UserRow = {
  id: number
  login: string
  password_hash: string
  role: UserRole
  must_change_password: number
  created_at: string
}

export type ListUserRow = {
  id: number
  login: string
  role: UserRole
  must_change_password: number
  created_at: string
}

export type ExerciseRow = {
  id: number
  slug: string
  name: string
  description: string
  detector_key: string
  voice_aliases_json: string
  sort_order: number
  is_active: number
  created_at: string
  updated_at: string
}

type ExerciseSeed = Omit<ExerciseRow, 'id' | 'created_at' | 'updated_at'>

export type CreateExerciseInput = {
  slug: string
  name: string
  description: string
  detectorKey: string
  voiceAliasesJson: string
  sortOrder: number
  isActive: boolean
}

export type UpdateExerciseInput = Partial<CreateExerciseInput>

export type ExerciseDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type ExerciseSetRow = {
  id: number
  name: string
  day_of_week: ExerciseDayOfWeek
  user_id: number
  created_by_user_id: number
  created_at: string
}

export type ExerciseSetExerciseRow = {
  workout_set_id: number
  exercise_id: number
  sort_order: number
}

export type CreateExerciseSetInput = {
  name: string
  dayOfWeek: ExerciseDayOfWeek
  userId: number
  createdByUserId: number
  exerciseIds: number[]
}

export const EXERCISE_SEEDS: ExerciseSeed[] = [
  {
    slug: 'biceps-curl',
    name: 'Подъем на бицепс',
    description: 'Классический подъем руки в локте стоя',
    detector_key: 'biceps-curl',
    voice_aliases_json: '["бицепс","подъем на бицепс"]',
    sort_order: 10,
    is_active: 1,
  },
  {
    slug: 'squat',
    name: 'Приседания',
    description: 'Базовые приседания с контролем глубины',
    detector_key: 'squat',
    voice_aliases_json: '["присед","приседания"]',
    sort_order: 20,
    is_active: 1,
  },
  {
    slug: 'army-press',
    name: 'Армейский жим',
    description: 'Жим вверх над головой',
    detector_key: 'army-press',
    voice_aliases_json: '["армейский жим","жим вверх"]',
    sort_order: 30,
    is_active: 1,
  },
  {
    slug: 'head-side-tilt',
    name: 'Наклоны головы вправо-влево',
    description: 'Наклоны головы в стороны с контролем амплитуды',
    detector_key: 'head-side-tilt',
    voice_aliases_json: '["наклоны головы","голова вправо влево"]',
    sort_order: 40,
    is_active: 1,
  },
]

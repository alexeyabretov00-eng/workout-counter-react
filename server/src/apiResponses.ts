import type { listExercises, listUsers, UserRole } from './db.js'

const parseVoiceAliases = (raw: string): string[] => {
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter((item): item is string => typeof item === 'string')
  } catch {
    return []
  }
}

export const buildUserResponse = (
  id: number,
  login: string,
  role: UserRole,
  mustChangePassword: boolean,
) => ({
  user: {
    id,
    login,
    role,
    mustChangePassword,
  },
})

export const buildAdminUserResponse = (row: ReturnType<typeof listUsers>[number]) => ({
  id: row.id,
  login: row.login,
  role: row.role,
  mustChangePassword: row.must_change_password === 1,
  createdAt: row.created_at,
})

export const buildExerciseResponse = (
  exercise: ReturnType<typeof listExercises>[number],
): {
  id: number
  slug: string
  name: string
  description: string
  detectorKey: string
  voiceAliases: string[]
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
} => {
  return {
    id: exercise.id,
    slug: exercise.slug,
    name: exercise.name,
    description: exercise.description,
    detectorKey: exercise.detector_key,
    voiceAliases: parseVoiceAliases(exercise.voice_aliases_json),
    sortOrder: exercise.sort_order,
    isActive: exercise.is_active === 1,
    createdAt: exercise.created_at,
    updatedAt: exercise.updated_at,
  }
}

import type { ExerciseDetector } from './types'

interface DetectorModuleShape {
  [key: string]: unknown
}

interface RequireContextShape {
  keys(): string[]
  <TResult = unknown>(id: string): TResult
}

interface LegacyRequireShape {
  context?: (
    directory: string,
    useSubdirectories?: boolean,
    regExp?: RegExp,
  ) => RequireContextShape
}

function isExerciseDetector(value: unknown): value is ExerciseDetector {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<ExerciseDetector>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.createState === 'function' &&
    typeof candidate.update === 'function'
  )
}

function collectFromRequireContext(): ExerciseDetector[] {
  const maybeRequire = (globalThis as { require?: LegacyRequireShape }).require
  if (!maybeRequire?.context) {
    return []
  }

  const context = maybeRequire.context('./', false, /Detector\.ts$/)
  const modules = context.keys().map((modulePath) => context<DetectorModuleShape>(modulePath))
  const detectors: ExerciseDetector[] = []

  for (const moduleExports of modules) {
    for (const exportedValue of Object.values(moduleExports)) {
      if (isExerciseDetector(exportedValue)) {
        detectors.push(exportedValue)
      }
    }
  }

  return detectors
}

function collectFromViteGlob(): ExerciseDetector[] {
  const modules = import.meta.glob<DetectorModuleShape>('./*Detector.ts', { eager: true })
  const detectors: ExerciseDetector[] = []

  for (const moduleExports of Object.values(modules)) {
    for (const exportedValue of Object.values(moduleExports)) {
      if (isExerciseDetector(exportedValue)) {
        detectors.push(exportedValue)
      }
    }
  }

  return detectors
}

function buildExerciseRegistry(): ExerciseDetector[] {
  const fromRequireContext = collectFromRequireContext()
  const rawDetectors = fromRequireContext.length > 0 ? fromRequireContext : collectFromViteGlob()
  const seenIds = new Set<string>()
  const activeDetectors = rawDetectors
    .filter((detector) => detector.isActive !== false)
    .filter((detector) => {
      if (seenIds.has(detector.id)) {
        return false
      }
      seenIds.add(detector.id)
      return true
    })
    .sort((left, right) => left.id.localeCompare(right.id))

  if (activeDetectors.length === 0) {
    throw new Error('Exercise registry is empty. Add at least one active detector.')
  }

  return activeDetectors
}

export const exerciseRegistry: ExerciseDetector[] = buildExerciseRegistry()

export function getExerciseById(id: string): ExerciseDetector {
  return exerciseRegistry.find((exercise) => exercise.id === id) ?? exerciseRegistry[0]
}

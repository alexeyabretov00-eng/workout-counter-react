import type { ExerciseDetector } from './types';

type DetectorModuleShape = {
  [key: string]: unknown;
};

const isExerciseDetector = (value: unknown): value is ExerciseDetector => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<ExerciseDetector>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.createState === 'function' &&
    typeof candidate.update === 'function'
  );
};

const collectFromViteGlob = (): ExerciseDetector[] => {
  const modules = import.meta.glob<DetectorModuleShape>('./**/*Detector.ts', {
    eager: true,
  });
  const detectors: ExerciseDetector[] = [];

  for (const moduleExports of Object.values(modules)) {
    for (const exportedValue of Object.values(moduleExports)) {
      if (isExerciseDetector(exportedValue)) {
        detectors.push(exportedValue);
      }
    }
  }

  return detectors;
};

const buildExerciseRegistry = (): ExerciseDetector[] => {
  const activeDetectors = collectFromViteGlob()
    .filter(detector => detector.isActive)
    .sort((left, right) => left.id.localeCompare(right.id));

  if (!activeDetectors.length) {
    throw new Error('Exercise registry is empty. Add at least one active detector.');
  }

  return activeDetectors;
};

export const exerciseRegistry: ExerciseDetector[] = buildExerciseRegistry();

export const getExerciseDetectorByIdOrDefault = (id: string): ExerciseDetector => {
  return exerciseRegistry.find(exercise => exercise.id === id) ?? exerciseRegistry.at(0)!;
};

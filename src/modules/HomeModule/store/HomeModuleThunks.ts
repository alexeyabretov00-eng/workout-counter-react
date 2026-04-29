import { createAsyncThunk } from '@reduxjs/toolkit';

import { exerciseClient } from '../api';
import { exerciseRegistry } from '../exercises';

import type { HomeModuleExerciseCatalogEntry } from './types';

export const fetchExerciseCatalog = createAsyncThunk<HomeModuleExerciseCatalogEntry[], void>(
  'home/fetchExerciseCatalog',
  async () => {
    const detectorById = new Map(exerciseRegistry.map(exercise => [exercise.id, exercise]));
    const response = await exerciseClient.list();

    const mappedEntries = response.exercises
      .map<HomeModuleExerciseCatalogEntry | null>(exercise => {
        const detector = detectorById.get(exercise.detectorKey);
        if (!detector) {
          return null;
        }

        return {
          id: exercise.slug,
          detectorId: detector.id,
          name: exercise.name,
          voiceAliases: exercise.voiceAliases,
        };
      })
      .filter((entry): entry is HomeModuleExerciseCatalogEntry => entry !== null);

    return mappedEntries;
  },
);

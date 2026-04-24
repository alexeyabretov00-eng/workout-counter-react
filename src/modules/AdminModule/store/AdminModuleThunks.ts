import type { ExerciseDto } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { adminExerciseClient } from '../api';

import type { AdminExerciseFormValues } from './types';

const parseAliases = (raw: string): string[] => {
  return raw
    .split(',')
    .map(alias => alias.trim())
    .filter(Boolean);
};

export const fetchAdminExercises = createAsyncThunk<ExerciseDto[], void>(
  'admin/fetchExercises',
  async () => {
    const response = await adminExerciseClient.list();
    return response.exercises;
  },
);

export const createAdminExercise = createAsyncThunk<ExerciseDto[], AdminExerciseFormValues>(
  'admin/createExercise',
  async values => {
    await adminExerciseClient.create({
      slug: values.slug,
      name: values.name,
      description: values.description,
      detectorKey: values.detectorKey,
      voiceAliases: parseAliases(values.voiceAliases),
      sortOrder: values.sortOrder,
      isActive: values.isActive,
    });
    const response = await adminExerciseClient.list();
    return response.exercises;
  },
);

export const updateAdminExercise = createAsyncThunk<
  ExerciseDto[],
  { id: number; values: AdminExerciseFormValues }
>('admin/updateExercise', async ({ id, values }) => {
  await adminExerciseClient.update(id, {
    slug: values.slug,
    name: values.name,
    description: values.description,
    detectorKey: values.detectorKey,
    voiceAliases: parseAliases(values.voiceAliases),
    sortOrder: values.sortOrder,
    isActive: values.isActive,
  });
  const response = await adminExerciseClient.list();
  return response.exercises;
});

export const archiveAdminExercise = createAsyncThunk<ExerciseDto[], number>(
  'admin/archiveExercise',
  async id => {
    await adminExerciseClient.archive(id);
    const response = await adminExerciseClient.list();
    return response.exercises;
  },
);

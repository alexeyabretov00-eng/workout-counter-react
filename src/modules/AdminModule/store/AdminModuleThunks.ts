import type { ExerciseDto } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { exerciseClient } from '@modules/HomeModule/api';

import type { AssignableUserDto } from '../api';
import type { ExerciseSetDto } from '../api';
import { adminExerciseClient, adminExerciseSetClient } from '../api';

import type { AdminExerciseFormValues, AdminExerciseSetFormValues } from './types';

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

export const fetchPublicExercises = createAsyncThunk<ExerciseDto[], void>(
  'admin/fetchPublicExercises',
  async () => {
    const response = await exerciseClient.list();
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

export const fetchAdminExerciseSets = createAsyncThunk<ExerciseSetDto[], void>(
  'admin/fetchExerciseSets',
  async () => {
    const response = await adminExerciseSetClient.list();
    return response.sets;
  },
);

export const fetchAssignableUsers = createAsyncThunk<AssignableUserDto[], void>(
  'admin/fetchAssignableUsers',
  async () => {
    const response = await adminExerciseSetClient.listAssignableUsers();
    return response.users;
  },
);

export const createAdminExerciseSet = createAsyncThunk<
  ExerciseSetDto[],
  AdminExerciseSetFormValues
>('admin/createExerciseSet', async values => {
  await adminExerciseSetClient.create(values);
  const response = await adminExerciseSetClient.list();
  return response.sets;
});

export const updateAdminExerciseSet = createAsyncThunk<
  ExerciseSetDto[],
  { id: number; values: AdminExerciseSetFormValues }
>('admin/updateExerciseSet', async ({ id, values }) => {
  await adminExerciseSetClient.update(id, values);
  const response = await adminExerciseSetClient.list();
  return response.sets;
});

export const deleteAdminExerciseSet = createAsyncThunk<ExerciseSetDto[], number>(
  'admin/deleteExerciseSet',
  async id => {
    await adminExerciseSetClient.delete(id);
    const response = await adminExerciseSetClient.list();
    return response.sets;
  },
);

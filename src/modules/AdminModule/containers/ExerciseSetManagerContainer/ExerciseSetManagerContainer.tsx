import { useEffect } from 'react';
import { message } from 'antd';

import { selectAuthUser, useAppDispatch, useAppSelector } from '@store';

import { ExerciseSetManager, type ExerciseSetManagerValues } from '../../components';
import { getAdminModuleProps } from '../../selectors';
import {
  createAdminExerciseSet,
  deleteAdminExerciseSet,
  fetchAdminExercises,
  fetchAdminExerciseSets,
  fetchAssignableUsers,
  fetchPublicExercises,
  updateAdminExerciseSet,
} from '../../store';

export const ExerciseSetManagerContainer = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(selectAuthUser);
  const { exercises, exerciseSets, assignableUsers, isSetsLoading, isSetSubmitting } =
    useAppSelector(getAdminModuleProps);
  const [messageApi, messageContextHolder] = message.useMessage();

  const isAdminOrSuperadmin = authUser?.role === 'admin' || authUser?.role === 'superadmin';
  const isUserRole = authUser?.role === 'user';

  useEffect(() => {
    const thunk = isUserRole ? fetchPublicExercises : fetchAdminExercises;

    void dispatch(thunk())
      .unwrap()
      .catch(error => {
        console.error('Failed to load exercises in admin', error);
        messageApi.error('Не удалось загрузить список упражнений.');
      });
  }, [dispatch, isUserRole, messageApi]);

  useEffect(() => {
    void dispatch(fetchAdminExerciseSets())
      .unwrap()
      .catch(error => {
        console.error('Failed to load exercise sets in admin', error);
        messageApi.error('Не удалось загрузить сеты упражнений.');
      });
  }, [dispatch, messageApi]);

  useEffect(() => {
    if (!isAdminOrSuperadmin) {
      return;
    }

    void dispatch(fetchAssignableUsers())
      .unwrap()
      .catch(error => {
        console.error('Failed to load assignable users in admin', error);
        messageApi.error('Не удалось загрузить список пользователей.');
      });
  }, [dispatch, isAdminOrSuperadmin, messageApi]);

  const handleCreateExerciseSet = async (values: ExerciseSetManagerValues) => {
    try {
      const payload: ExerciseSetManagerValues = {
        ...values,
        userId: authUser?.role === 'user' ? undefined : values.userId,
      };
      await dispatch(createAdminExerciseSet(payload as ExerciseSetManagerValues)).unwrap();
      messageApi.success('Сет упражнений создан.');
    } catch (error) {
      console.error('Failed to create exercise set', error);
      messageApi.error('Не удалось создать сет упражнений.');
    }
  };

  const handleUpdateExerciseSet = async (id: number, values: ExerciseSetManagerValues) => {
    try {
      const payload: ExerciseSetManagerValues = {
        ...values,
        userId: authUser?.role === 'user' ? undefined : values.userId,
      };
      await dispatch(updateAdminExerciseSet({ id, values: payload })).unwrap();
      messageApi.success('Сет упражнений обновлен.');
    } catch (error) {
      console.error('Failed to update exercise set', error);
      messageApi.error('Не удалось обновить сет упражнений.');
    }
  };

  const handleDeleteExerciseSet = async (id: number) => {
    try {
      await dispatch(deleteAdminExerciseSet(id)).unwrap();
      messageApi.success('Сет упражнений удален.');
    } catch (error) {
      console.error('Failed to delete exercise set', error);
      messageApi.error('Не удалось удалить сет упражнений.');
    }
  };

  return (
    <>
      {messageContextHolder}
      <ExerciseSetManager
        exercises={exercises.filter(exercise => exercise.isActive)}
        exerciseSets={exerciseSets}
        assignableUsers={assignableUsers}
        currentUserRole={authUser?.role ?? 'user'}
        isLoading={isSetsLoading}
        isSubmitting={isSetSubmitting}
        onCreate={handleCreateExerciseSet}
        onUpdate={handleUpdateExerciseSet}
        onDelete={handleDeleteExerciseSet}
      />
    </>
  );
};

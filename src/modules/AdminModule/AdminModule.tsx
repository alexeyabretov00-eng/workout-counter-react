import { useEffect } from 'react';
import { message } from 'antd';

import { useAppDispatch, useAppSelector } from '@store';

import {
  AdminPageShell,
  ExerciseCatalogManager,
  type ExerciseCatalogManagerValues,
} from './components';
import { getAdminModuleProps } from './selectors';
import {
  archiveAdminExercise,
  createAdminExercise,
  fetchAdminExercises,
  updateAdminExercise,
} from './store';

export const AdminModule = () => {
  const dispatch = useAppDispatch();
  const { exercises, isLoading, isSubmitting } = useAppSelector(getAdminModuleProps);
  const [messageApi, messageContextHolder] = message.useMessage();

  useEffect(() => {
    void dispatch(fetchAdminExercises())
      .unwrap()
      .catch(error => {
        console.error('Failed to load exercises in admin', error);
        messageApi.error('Не удалось загрузить список упражнений.');
      });
  }, [dispatch, messageApi]);

  const handleCreate = async (values: ExerciseCatalogManagerValues) => {
    try {
      await dispatch(createAdminExercise(values)).unwrap();
      messageApi.success('Упражнение создано.');
    } catch (error) {
      console.error('Failed to create exercise', error);
      messageApi.error('Не удалось создать упражнение.');
    }
  };

  const handleUpdate = async (id: number, values: ExerciseCatalogManagerValues) => {
    try {
      await dispatch(updateAdminExercise({ id, values })).unwrap();
      messageApi.success('Упражнение обновлено.');
    } catch (error) {
      console.error('Failed to update exercise', error);
      messageApi.error('Не удалось обновить упражнение.');
    }
  };

  const handleArchive = async (id: number) => {
    try {
      await dispatch(archiveAdminExercise(id)).unwrap();
      messageApi.success('Упражнение архивировано.');
    } catch (error) {
      console.error('Failed to archive exercise', error);
      messageApi.error('Не удалось архивировать упражнение.');
    }
  };

  return (
    <AdminPageShell title="Админка">
      {messageContextHolder}
      <ExerciseCatalogManager
        exercises={exercises}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onArchive={handleArchive}
      />
    </AdminPageShell>
  );
};

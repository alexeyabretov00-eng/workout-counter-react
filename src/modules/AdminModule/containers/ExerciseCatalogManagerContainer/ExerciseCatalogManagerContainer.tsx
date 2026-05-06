import { message } from 'antd';

import { useAppDispatch, useAppSelector } from '@store';

import { ExerciseCatalogManager, type ExerciseCatalogManagerValues } from '../../components';
import { getAdminModuleProps } from '../../selectors';
import { archiveAdminExercise, createAdminExercise, updateAdminExercise } from '../../store';

export const ExerciseCatalogManagerContainer = () => {
  const dispatch = useAppDispatch();
  const { exercises, isLoading, isSubmitting } = useAppSelector(getAdminModuleProps);
  const [messageApi, messageContextHolder] = message.useMessage();

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
    <>
      {messageContextHolder}
      <ExerciseCatalogManager
        exercises={exercises}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onArchive={handleArchive}
      />
    </>
  );
};

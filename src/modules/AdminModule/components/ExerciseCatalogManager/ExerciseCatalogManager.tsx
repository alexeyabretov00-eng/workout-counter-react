import { useState } from 'react';
import type { ExerciseDto } from '@api';
import { Button, Drawer } from 'antd';

import { ExerciseCatalogCreateDrawer } from './ExerciseCatalogCreateDrawer';
import { ExerciseCatalogEditForm } from './ExerciseCatalogEditForm';
import { ExerciseCatalogExercisesTable } from './ExerciseCatalogExercisesTable';
import { ManagerRoot } from './ExerciseCatalogManager.styled';
import type { ExerciseCatalogManagerProps, ExerciseCatalogManagerValues } from './types';

export const ExerciseCatalogManager: React.FC<ExerciseCatalogManagerProps> = ({
  exercises,
  isLoading,
  isSubmitting,
  onCreate,
  onUpdate,
  onArchive,
}) => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseDto | null>(null);

  const closeEditDrawer = () => setEditingExercise(null);

  const handleUpdate = async (id: number, values: ExerciseCatalogManagerValues) => {
    await onUpdate(id, values);
    closeEditDrawer();
  };

  const handleArchive = async (id: number) => {
    await onArchive(id);
    closeEditDrawer();
  };

  return (
    <ManagerRoot orientation="vertical" size="large">
      <Button type="primary" onClick={() => setIsCreateDrawerOpen(true)}>
        Добавить упражнение
      </Button>

      <ExerciseCatalogCreateDrawer
        isOpen={isCreateDrawerOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsCreateDrawerOpen(false)}
        onCreate={onCreate}
      />

      <ExerciseCatalogExercisesTable
        exercises={exercises}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onEdit={setEditingExercise}
      />

      <Drawer
        title={
          editingExercise ? `Редактирование: ${editingExercise.name}` : 'Редактирование упражнения'
        }
        placement="right"
        size="large"
        onClose={closeEditDrawer}
        open={Boolean(editingExercise)}
        destroyOnHidden>
        {editingExercise ? (
          <ExerciseCatalogEditForm
            record={editingExercise}
            isSubmitting={isSubmitting}
            onUpdate={handleUpdate}
            onArchive={handleArchive}
            onCancel={closeEditDrawer}
          />
        ) : null}
      </Drawer>
    </ManagerRoot>
  );
};

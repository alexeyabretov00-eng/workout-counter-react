import { useState } from 'react';
import { Button } from 'antd';

import { ExerciseCatalogCreateDrawer } from './ExerciseCatalogCreateDrawer';
import { ExerciseCatalogExercisesTable } from './ExerciseCatalogExercisesTable';
import { ManagerRoot } from './ExerciseCatalogManager.styled';
import type { ExerciseCatalogManagerProps } from './types';

export const ExerciseCatalogManager: React.FC<ExerciseCatalogManagerProps> = ({
  exercises,
  isLoading,
  isSubmitting,
  onCreate,
  onUpdate,
  onArchive,
}) => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

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
        onUpdate={onUpdate}
        onArchive={onArchive}
      />
    </ManagerRoot>
  );
};

import type { ExerciseDto } from '@api';
import { Table, Tag } from 'antd';

import { ExerciseCatalogEditForm } from './ExerciseCatalogEditForm';
import type { ExerciseCatalogManagerValues } from './types';

type ExerciseCatalogExercisesTableProps = {
  exercises: ExerciseDto[];
  isLoading: boolean;
  isSubmitting: boolean;
  onUpdate: (id: number, values: ExerciseCatalogManagerValues) => Promise<void>;
  onArchive: (id: number) => Promise<void>;
};

export const ExerciseCatalogExercisesTable: React.FC<ExerciseCatalogExercisesTableProps> = ({
  exercises,
  isLoading,
  isSubmitting,
  onUpdate,
  onArchive,
}) => (
  <Table<ExerciseDto>
    loading={isLoading}
    dataSource={exercises}
    rowKey="id"
    pagination={false}
    expandable={{
      expandedRowRender: record => (
        <ExerciseCatalogEditForm
          record={record}
          isSubmitting={isSubmitting}
          onUpdate={onUpdate}
          onArchive={onArchive}
        />
      ),
    }}
    columns={[
      { title: 'ID', dataIndex: 'id', width: 80 },
      { title: 'Slug', dataIndex: 'slug' },
      { title: 'Название', dataIndex: 'name' },
      { title: 'Detector', dataIndex: 'detectorKey' },
      { title: 'Порядок', dataIndex: 'sortOrder', width: 90 },
      {
        title: 'Статус',
        width: 110,
        render: (_, record) =>
          record.isActive ? <Tag color="green">active</Tag> : <Tag color="default">inactive</Tag>,
      },
    ]}
  />
);

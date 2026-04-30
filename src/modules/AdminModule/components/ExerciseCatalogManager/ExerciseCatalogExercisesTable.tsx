import type { ExerciseDto } from '@api';
import { Button, Table, Tag } from 'antd';

type ExerciseCatalogExercisesTableProps = {
  exercises: ExerciseDto[];
  isLoading: boolean;
  isSubmitting: boolean;
  onEdit: (record: ExerciseDto) => void;
};

export const ExerciseCatalogExercisesTable: React.FC<ExerciseCatalogExercisesTableProps> = ({
  exercises,
  isLoading,
  isSubmitting,
  onEdit,
}) => (
  <Table<ExerciseDto>
    loading={isLoading}
    dataSource={exercises}
    rowKey="id"
    pagination={false}
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
      {
        title: 'Действия',
        width: 140,
        render: (_, record) => (
          <Button onClick={() => onEdit(record)} disabled={isSubmitting}>
            Редактировать
          </Button>
        ),
      },
    ]}
  />
);

import { useState } from 'react';
import {
  Button,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd';

import type { ExerciseSetDto } from '../../api';

import { ExerciseSetManagerRoot } from './ExerciseSetManager.styled';
import type { ExerciseSetManagerProps, ExerciseSetManagerValues } from './types';

const dayOptions: Array<{ value: ExerciseSetManagerValues['dayOfWeek']; label: string }> = [
  { value: 0, label: 'Понедельник' },
  { value: 1, label: 'Вторник' },
  { value: 2, label: 'Среда' },
  { value: 3, label: 'Четверг' },
  { value: 4, label: 'Пятница' },
  { value: 5, label: 'Суббота' },
  { value: 6, label: 'Воскресенье' },
];

const dayLabelByValue = new Map(dayOptions.map(item => [item.value, item.label]));

export const ExerciseSetManager: React.FC<ExerciseSetManagerProps> = ({
  exercises,
  exerciseSets,
  assignableUsers,
  currentUserRole,
  isLoading,
  isSubmitting,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [createForm] = Form.useForm<ExerciseSetManagerValues>();
  const [editForm] = Form.useForm<ExerciseSetManagerValues>();
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<ExerciseSetDto | null>(null);
  const canPickUser = currentUserRole === 'admin' || currentUserRole === 'superadmin';

  const exerciseOptions = exercises.map(exercise => ({ label: exercise.name, value: exercise.id }));
  const exerciseNameById = new Map(exercises.map(exercise => [exercise.id, exercise.name]));
  const userOptions = assignableUsers.map(user => ({ label: user.login, value: user.id }));

  const handleCreate = async (values: ExerciseSetManagerValues) => {
    await onCreate(values);
    createForm.resetFields();
    setIsCreateDrawerOpen(false);
  };

  const openEditDrawer = (set: ExerciseSetDto) => {
    setEditingSet(set);
    editForm.setFieldsValue({
      name: set.name,
      dayOfWeek: set.dayOfWeek,
      exerciseIds: set.exerciseIds,
      userId: canPickUser ? set.userId : undefined,
    });
  };

  const closeEditDrawer = () => {
    setEditingSet(null);
    editForm.resetFields();
  };

  const handleUpdate = async (values: ExerciseSetManagerValues) => {
    if (!editingSet) {
      return;
    }
    await onUpdate(editingSet.id, values);
    closeEditDrawer();
  };

  return (
    <ExerciseSetManagerRoot orientation="vertical" size="large">
      <Space>
        <Button type="primary" onClick={() => setIsCreateDrawerOpen(true)}>
          Создать сет
        </Button>
      </Space>

      <Drawer
        title="Создание сета упражнений"
        placement="right"
        size="large"
        onClose={() => setIsCreateDrawerOpen(false)}
        open={isCreateDrawerOpen}
        destroyOnHidden>
        <Form<ExerciseSetManagerValues>
          form={createForm}
          layout="vertical"
          initialValues={{ dayOfWeek: 0, exerciseIds: [] }}
          onFinish={handleCreate}>
          <Form.Item
            label="Название сета"
            name="name"
            rules={[{ required: true, message: 'Введите название сета.' }]}>
            <Input maxLength={120} placeholder="Например, Базовый день груди" />
          </Form.Item>

          <Form.Item
            label="День недели"
            name="dayOfWeek"
            rules={[{ required: true, message: 'Выберите день недели.' }]}>
            <Select options={dayOptions} />
          </Form.Item>

          <Form.Item
            label="Упражнения"
            name="exerciseIds"
            rules={[{ required: true, message: 'Выберите хотя бы одно упражнение.' }]}>
            <Select mode="multiple" options={exerciseOptions} placeholder="Выберите упражнения" />
          </Form.Item>

          {canPickUser ? (
            <Form.Item
              label="Пользователь"
              name="userId"
              rules={[{ required: true, message: 'Выберите пользователя.' }]}>
              <Select options={userOptions} placeholder="Выберите пользователя" />
            </Form.Item>
          ) : null}

          <Space>
            <Button onClick={() => setIsCreateDrawerOpen(false)}>Отмена</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Создать сет
            </Button>
          </Space>
        </Form>
      </Drawer>

      <Drawer
        title={editingSet ? `Редактирование: ${editingSet.name}` : 'Редактирование сета'}
        placement="right"
        size="large"
        onClose={closeEditDrawer}
        open={Boolean(editingSet)}
        destroyOnHidden>
        <Form<ExerciseSetManagerValues> form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            label="Название сета"
            name="name"
            rules={[{ required: true, message: 'Введите название сета.' }]}>
            <Input maxLength={120} placeholder="Например, Базовый день груди" />
          </Form.Item>

          <Form.Item
            label="День недели"
            name="dayOfWeek"
            rules={[{ required: true, message: 'Выберите день недели.' }]}>
            <Select options={dayOptions} />
          </Form.Item>

          <Form.Item
            label="Упражнения"
            name="exerciseIds"
            rules={[{ required: true, message: 'Выберите хотя бы одно упражнение.' }]}>
            <Select mode="multiple" options={exerciseOptions} placeholder="Выберите упражнения" />
          </Form.Item>

          {canPickUser ? (
            <Form.Item
              label="Пользователь"
              name="userId"
              rules={[{ required: true, message: 'Выберите пользователя.' }]}>
              <Select options={userOptions} placeholder="Выберите пользователя" />
            </Form.Item>
          ) : null}

          <Space>
            <Button onClick={closeEditDrawer}>Отмена</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Сохранить изменения
            </Button>
          </Space>
        </Form>
      </Drawer>

      <Space orientation="vertical" size="small">
        <Typography.Title level={5}>Созданные сеты</Typography.Title>
        <Spin spinning={isLoading}>
          <Table
            rowKey="id"
            dataSource={exerciseSets}
            pagination={false}
            columns={[
              { title: 'Название', dataIndex: 'name', key: 'name' },
              {
                title: 'День',
                dataIndex: 'dayOfWeek',
                key: 'dayOfWeek',
                render: (value: ExerciseSetManagerValues['dayOfWeek']) =>
                  dayLabelByValue.get(value) ?? String(value),
              },
              { title: 'Пользователь', dataIndex: 'userLogin', key: 'userLogin' },
              {
                title: 'Упражнения',
                dataIndex: 'exerciseIds',
                key: 'exerciseIds',
                render: (ids: number[]) => (
                  <Space wrap>
                    {ids.map(id => (
                      <Tag key={id}>{exerciseNameById.get(id) ?? `#${String(id)}`}</Tag>
                    ))}
                  </Space>
                ),
              },
              {
                title: 'Действия',
                key: 'actions',
                render: (_: unknown, record: ExerciseSetDto) => (
                  <Space>
                    <Button onClick={() => openEditDrawer(record)}>Редактировать</Button>
                    <Popconfirm
                      title="Удалить сет?"
                      description="Это действие нельзя отменить."
                      okText="Удалить"
                      cancelText="Отмена"
                      onConfirm={() => onDelete(record.id)}>
                      <Button danger loading={isSubmitting}>
                        Удалить
                      </Button>
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        </Spin>
      </Space>
    </ExerciseSetManagerRoot>
  );
};

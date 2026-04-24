import { useState } from 'react';
import type { ExerciseDto } from '@api';
import { Button, Drawer, Form, Input, Popconfirm, Space, Switch, Table, Tag } from 'antd';

import { FullWidthInputNumber, ManagerRoot } from './ExerciseCatalogManager.styled';

const { TextArea } = Input;

export type ExerciseCatalogManagerValues = {
  slug: string;
  name: string;
  description: string;
  detectorKey: string;
  voiceAliases: string;
  sortOrder: number;
  isActive: boolean;
};

export type ExerciseCatalogManagerProps = {
  exercises: ExerciseDto[];
  isLoading: boolean;
  isSubmitting: boolean;
  onCreate: (values: ExerciseCatalogManagerValues) => Promise<void>;
  onUpdate: (id: number, values: ExerciseCatalogManagerValues) => Promise<void>;
  onArchive: (id: number) => Promise<void>;
};

export const ExerciseCatalogManager = ({
  exercises,
  isLoading,
  isSubmitting,
  onCreate,
  onUpdate,
  onArchive,
}: ExerciseCatalogManagerProps) => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [createForm] = Form.useForm<ExerciseCatalogManagerValues>();
  const [editForm] = Form.useForm<ExerciseCatalogManagerValues>();

  const handleCreate = async (values: ExerciseCatalogManagerValues) => {
    await onCreate(values);
    createForm.resetFields();
    setIsCreateDrawerOpen(false);
  };

  return (
    <ManagerRoot orientation="vertical" size="large">
      <Button type="primary" onClick={() => setIsCreateDrawerOpen(true)}>
        Добавить упражнение
      </Button>

      <Drawer
        title="Новое упражнение"
        placement="right"
        size="large"
        onClose={() => setIsCreateDrawerOpen(false)}
        open={isCreateDrawerOpen}
        destroyOnHidden>
        <Form
          form={createForm}
          layout="vertical"
          initialValues={{ sortOrder: 100, isActive: true, voiceAliases: '' }}
          onFinish={handleCreate}>
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
            <Input placeholder="biceps-curl" />
          </Form.Item>
          <Form.Item name="name" label="Название" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Описание" rules={[{ required: true }]}>
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="detectorKey" label="Detector key" rules={[{ required: true }]}>
            <Input placeholder="biceps-curl" />
          </Form.Item>
          <Form.Item name="voiceAliases" label="Голосовые алиасы (через запятую)">
            <Input />
          </Form.Item>
          <Form.Item name="sortOrder" label="Порядок" rules={[{ required: true }]}>
            <FullWidthInputNumber min={0} max={10000} />
          </Form.Item>
          <Form.Item name="isActive" label="Активно" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Space>
            <Button onClick={() => setIsCreateDrawerOpen(false)}>Отмена</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Создать
            </Button>
          </Space>
        </Form>
      </Drawer>

      <Table<ExerciseDto>
        loading={isLoading}
        dataSource={exercises}
        rowKey="id"
        pagination={false}
        expandable={{
          expandedRowRender: record => (
            <Form
              form={editForm}
              layout="vertical"
              initialValues={{
                slug: record.slug,
                name: record.name,
                description: record.description,
                detectorKey: record.detectorKey,
                voiceAliases: record.voiceAliases.join(', '),
                sortOrder: record.sortOrder,
                isActive: record.isActive,
              }}
              onFinish={values => onUpdate(record.id, values)}>
              <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="name" label="Название" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Описание" rules={[{ required: true }]}>
                <TextArea rows={2} />
              </Form.Item>
              <Form.Item name="detectorKey" label="Detector key" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="voiceAliases" label="Голосовые алиасы (через запятую)">
                <Input />
              </Form.Item>
              <Form.Item name="sortOrder" label="Порядок" rules={[{ required: true }]}>
                <FullWidthInputNumber min={0} max={10000} />
              </Form.Item>
              <Form.Item name="isActive" label="Активно" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Space>
                <Button htmlType="submit" type="primary" loading={isSubmitting}>
                  Сохранить
                </Button>
                <Popconfirm
                  title="Архивировать упражнение?"
                  okText="Да"
                  cancelText="Нет"
                  onConfirm={() => onArchive(record.id)}>
                  <Button danger loading={isSubmitting}>
                    Архивировать
                  </Button>
                </Popconfirm>
              </Space>
            </Form>
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
              record.isActive ? (
                <Tag color="green">active</Tag>
              ) : (
                <Tag color="default">inactive</Tag>
              ),
          },
        ]}
      />
    </ManagerRoot>
  );
};

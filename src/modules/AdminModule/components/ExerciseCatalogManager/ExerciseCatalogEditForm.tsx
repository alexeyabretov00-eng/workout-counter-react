import type { ExerciseDto } from '@api';
import { Button, Form, Input, Popconfirm, Space, Switch } from 'antd';

import { FullWidthInputNumber } from './ExerciseCatalogManager.styled';
import type { ExerciseCatalogManagerValues } from './types';

const { TextArea } = Input;

type ExerciseCatalogEditFormProps = {
  record: ExerciseDto;
  isSubmitting: boolean;
  onUpdate: (id: number, values: ExerciseCatalogManagerValues) => Promise<void>;
  onArchive: (id: number) => Promise<void>;
};

export const ExerciseCatalogEditForm: React.FC<ExerciseCatalogEditFormProps> = ({
  record,
  isSubmitting,
  onUpdate,
  onArchive,
}) => (
  <Form
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
);

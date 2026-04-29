import { Button, Drawer, Form, Input, Space, Switch } from 'antd';

import { FullWidthInputNumber } from './ExerciseCatalogManager.styled';
import type { ExerciseCatalogManagerValues } from './types';

const { TextArea } = Input;

type ExerciseCatalogCreateDrawerProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (values: ExerciseCatalogManagerValues) => Promise<void>;
};

export const ExerciseCatalogCreateDrawer: React.FC<ExerciseCatalogCreateDrawerProps> = ({
  isOpen,
  isSubmitting,
  onClose,
  onCreate,
}) => {
  const [form] = Form.useForm<ExerciseCatalogManagerValues>();

  const handleCreate = async (values: ExerciseCatalogManagerValues) => {
    await onCreate(values);
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title="Новое упражнение"
      placement="right"
      size="large"
      onClose={onClose}
      open={isOpen}
      destroyOnHidden>
      <Form
        form={form}
        layout="vertical"
        initialValues={{ sortOrder: 100, isActive: true, voiceAliases: '' }}
        onFinish={handleCreate}>
        <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
          <Input placeholder="exercise-slug" />
        </Form.Item>
        <Form.Item name="name" label="Название" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Описание" rules={[{ required: true }]}>
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="detectorKey" label="Detector key" rules={[{ required: true }]}>
          <Input placeholder="detector-key" />
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
          <Button onClick={onClose}>Отмена</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Создать
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
};

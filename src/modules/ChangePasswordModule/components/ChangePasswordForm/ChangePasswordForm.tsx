import { Alert, Form, Input } from 'antd';

import { Button } from '@components';

export type ChangePasswordFormProps = {
  password: string;
  pending: boolean;
  isSubmitDisabled: boolean;
  error: string | null;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void | Promise<void>;
};

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  password,
  pending,
  isSubmitDisabled,
  error,
  onPasswordChange,
  onSubmit,
}) => {
  return (
    <Form
      layout="vertical"
      requiredMark={false}
      onFinish={() => {
        void onSubmit();
      }}
      noValidate>
      {error ? <Alert type="error" showIcon title={error} /> : null}
      <Form.Item label="Новый пароль" htmlFor="new-password-input">
        <Input.Password
          id="new-password-input"
          name="newPassword"
          autoComplete="new-password"
          value={password}
          onChange={event => {
            onPasswordChange(event.target.value);
          }}
          disabled={pending}
        />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" disabled={isSubmitDisabled} block>
          {pending ? 'Сохраняем…' : 'Сменить пароль'}
        </Button>
      </Form.Item>
    </Form>
  );
};

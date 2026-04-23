import { Typography } from 'antd';

const { Text } = Typography;

export type AdminPageStubProps = {
  lead: string;
};

export const AdminPageStub = ({ lead }: AdminPageStubProps) => {
  return (
    <Text type="secondary" style={{ display: 'block' }}>
      {lead}
    </Text>
  );
};

import { Typography } from 'antd';

const { Text } = Typography;

export type ExerciseHistoryPageStubProps = {
  lead: string;
};

export const ExerciseHistoryPageStub = ({ lead }: ExerciseHistoryPageStubProps) => {
  return (
    <Text type="secondary" style={{ display: 'block' }}>
      {lead}
    </Text>
  );
};

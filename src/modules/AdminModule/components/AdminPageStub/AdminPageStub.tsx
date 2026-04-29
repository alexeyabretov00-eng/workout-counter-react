import { StubText } from './AdminPageStub.styled';

export type AdminPageStubProps = {
  lead: string;
};

export const AdminPageStub: React.FC<AdminPageStubProps> = ({ lead }) => (
  <StubText type="secondary">{lead}</StubText>
);

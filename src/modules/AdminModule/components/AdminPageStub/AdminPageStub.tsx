import { StubText } from './AdminPageStub.styled';

export type AdminPageStubProps = {
  lead: string;
};

export const AdminPageStub = ({ lead }: AdminPageStubProps) => (
  <StubText type="secondary">{lead}</StubText>
);

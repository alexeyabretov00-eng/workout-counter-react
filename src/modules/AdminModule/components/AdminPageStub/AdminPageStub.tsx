import { AdminPageLead } from './AdminPageStub.styled';

export type AdminPageStubProps = {
  lead: string;
};

export const AdminPageStub = ({ lead }: AdminPageStubProps) => {
  return <AdminPageLead>{lead}</AdminPageLead>;
};

import styled from 'styled-components';

export const AdminPageLead = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.palette.text.muted};
  font-size: ${({ theme }) => theme.typography.statusBar};
`;

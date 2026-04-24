import { Layout } from 'antd';
import styled from 'styled-components';

export const AppPageLayoutRoot = styled(Layout)`
  && {
    min-height: 100vh;
  }
`;

export const AppPageContent = styled(Layout.Content)`
  && {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
`;

export const RouteOutletFallbackRoot = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.palette.text.muted};
`;

import { Layout, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

export const Content = styled(Layout.Content)`
  box-sizing: border-box;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.palette.text.primary};
  font-family: ${({ theme }) => theme.typography.family};
  line-height: ${({ theme }) => theme.typography.lineHeight};
`;

export const ModuleScaffoldTitle = styled(Title).attrs({ level: 1 })`
  && {
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

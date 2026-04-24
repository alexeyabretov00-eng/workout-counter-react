import { Flex } from 'antd';
import styled from 'styled-components';

export const HomeLayoutSection = styled.section``;

export const HomeLayoutHeaderSection = styled(HomeLayoutSection)`
  & h1 {
    margin: 0;
  }

  & p {
    margin: ${({ theme }) => theme.spacing.sm} 0 0;
    color: ${({ theme }) => theme.palette.text.muted};
  }
`;

export const HomeLayoutStageSection = styled(HomeLayoutSection)`
  min-width: 0;
`;

export const FlexStyled = styled(Flex)`
  margin: '0 auto';
  max-width: ${({ theme }) => theme.layout.maxWidth};
  padding: ${({ theme }) => theme.spacing.xl};
  box-sizing: border-box;
`;

import { type ReactNode } from 'react';
import type { AppTheme } from '@theme';
import { useTheme } from 'styled-components';

import {
  FlexStyled,
  HomeLayoutHeaderSection,
  HomeLayoutSection,
  HomeLayoutStageSection,
} from './HomeLayout.styled';

export type HomeLayoutProps = {
  header: ReactNode;
  controls: ReactNode;
  statusBar: ReactNode;
  stage: ReactNode;
};

export const HomeLayout: React.FC<HomeLayoutProps> = ({ header, controls, statusBar, stage }) => {
  const t = useTheme() as AppTheme;

  return (
    <FlexStyled component="main" vertical gap={t.spacing.lg}>
      <HomeLayoutHeaderSection>{header}</HomeLayoutHeaderSection>
      <HomeLayoutSection>{controls}</HomeLayoutSection>
      <HomeLayoutSection>{statusBar}</HomeLayoutSection>
      <HomeLayoutStageSection>{stage}</HomeLayoutStageSection>
    </FlexStyled>
  );
};

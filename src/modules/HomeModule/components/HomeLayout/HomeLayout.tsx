import { type ReactNode } from 'react';

import {
  HomeLayoutHeaderSection,
  HomeLayoutRoot,
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
  return (
    <HomeLayoutRoot>
      <HomeLayoutHeaderSection>{header}</HomeLayoutHeaderSection>
      <HomeLayoutSection>{controls}</HomeLayoutSection>
      <HomeLayoutSection>{statusBar}</HomeLayoutSection>
      <HomeLayoutStageSection>{stage}</HomeLayoutStageSection>
    </HomeLayoutRoot>
  );
};

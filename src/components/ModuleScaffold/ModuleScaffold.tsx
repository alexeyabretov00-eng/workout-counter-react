import { Layout } from 'antd';

import { Content, ModuleScaffoldTitle } from './ModuleScaffold.styled';

export type ModuleScaffoldProps = {
  title: string;
};

/**
 * Стандартная оболочка страницы модуля: ограничение ширины и заголовок.
 * Стили отступов — из темы styled (`ThemeProvider`).
 */
export const ModuleScaffold: React.FC<React.PropsWithChildren<ModuleScaffoldProps>> = ({
  title,
  children,
}) => {
  return (
    <Layout>
      <Content>
        <ModuleScaffoldTitle>{title}</ModuleScaffoldTitle>
        {children}
      </Content>
    </Layout>
  );
};

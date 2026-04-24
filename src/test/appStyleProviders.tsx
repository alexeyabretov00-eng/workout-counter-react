import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';

import { getAntdThemeConfig, theme } from '@theme';

/** `ConfigProvider` (antd) + `ThemeProvider` (styled) — как в `App`, для тестов с ручным `render`. */
export const AppStyleProviders: React.FC<React.PropsWithChildren> = ({ children }) => (
  <ConfigProvider theme={getAntdThemeConfig(theme)}>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </ConfigProvider>
);

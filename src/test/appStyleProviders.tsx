import type { ReactNode } from 'react';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';

import { getAntdThemeConfig } from '../theme/antdConfig';
import { theme } from '../theme/theme';

/** `ConfigProvider` (antd) + `ThemeProvider` (styled) — как в `App`, для тестов с ручным `render`. */
export const AppStyleProviders = ({ children }: { children: ReactNode }) => (
  <ConfigProvider theme={getAntdThemeConfig(theme)}>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </ConfigProvider>
);

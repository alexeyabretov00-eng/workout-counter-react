import type { Preview } from '@storybook/react-vite';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';

import { getAntdThemeConfig, GlobalStyle, theme } from '@theme';

const preview: Preview = {
  decorators: [
    Story => (
      <ConfigProvider theme={getAntdThemeConfig(theme)}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Story />
        </ThemeProvider>
      </ConfigProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    backgrounds: {
      default: 'app',
      values: [{ name: 'app', value: theme.palette.surface.app }],
    },
  },
};

export default preview;

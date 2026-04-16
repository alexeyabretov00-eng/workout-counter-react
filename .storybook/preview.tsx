import type { Preview } from '@storybook/react-vite';
import { ThemeProvider } from 'styled-components';

import { GlobalStyle, theme } from '@theme';

const preview: Preview = {
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Story />
      </ThemeProvider>
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

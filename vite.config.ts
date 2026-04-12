import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import babel from 'vite-plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    babel({
      apply: 'serve',
      filter: /\.styled\.tsx$/,
      loader: (path: string) => (path.endsWith('.tsx') ? 'tsx' : 'js'),
      babelConfig: {
        presets: ['@babel/preset-typescript'],
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: false,
            },
          ],
        ],
      },
    }),
    react(),
  ],
  server: {
    open: true,
  },
  preview: {
    open: true,
  },
})

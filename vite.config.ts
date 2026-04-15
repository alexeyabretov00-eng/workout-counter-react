import { join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import babel from '@babel/core';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

const srcAliases: Record<string, string> = {
  '@api': join(srcDir, 'api'),
  '@app': join(srcDir, 'App'),
  '@components': join(srcDir, 'components'),
  '@contexts': join(srcDir, 'contexts'),
  '@pages': join(srcDir, 'pages'),
  '@routes': join(srcDir, 'routes'),
  '@theme': join(srcDir, 'theme'),
  '@types': join(srcDir, 'types'),
  '@utils': join(srcDir, 'utils'),
};

const vendorChunk = (id: string): string | undefined => {
  if (!id.includes('node_modules')) {
    return undefined;
  }
  const norm = id.replace(/\\/g, '/');
  if (norm.includes('@mediapipe')) {
    return 'mediapipe';
  }
  if (norm.includes('react-router')) {
    return 'react-router';
  }
  if (norm.includes('styled-components')) {
    return 'styled-components';
  }
  if (norm.includes('react-dom')) {
    return 'react-dom';
  }
  if (norm.includes('/react/')) {
    return 'react';
  }
  return undefined;
};

const styledComponentsDevPlugin = (): Plugin => {
  let root: string;
  let babelOptions: babel.TransformOptions | null = null;

  const getBabelOptions = (): babel.TransformOptions => {
    if (babelOptions) {
      return babelOptions;
    }
    const partial = babel.loadPartialConfig({
      cwd: root,
      root,
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
    });
    babelOptions = partial?.options ?? {};
    return babelOptions;
  };

  return {
    name: 'babel-styled-components-dev',
    enforce: 'pre',
    apply: 'serve',
    configResolved(config) {
      root = config.root;
    },
    async transform(code, id) {
      if (!/\.styled\.tsx(?:\?|$)/.test(id)) {
        return;
      }
      const opts = getBabelOptions();
      const result = await babel.transformAsync(code, { ...opts, filename: id });
      if (!result) {
        return;
      }
      return { code: result.code ?? '', map: result.map };
    },
  };
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: srcAliases,
  },
  plugins: [
    styledComponentsDevPlugin(),
    react(),
    ...(mode === 'analyze'
      ? [
          visualizer({
            filename: 'dist/bundle-stats.html',
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: vendorChunk,
      },
    },
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    open: true,
  },
}));

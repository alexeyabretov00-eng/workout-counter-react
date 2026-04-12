import babel from '@babel/core'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

const styledComponentsDevPlugin = (): Plugin => {
  let root: string
  let babelOptions: babel.TransformOptions | null = null

  const getBabelOptions = (): babel.TransformOptions => {
    if (babelOptions) return babelOptions
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
    })
    babelOptions = partial?.options ?? {}
    return babelOptions
  }

  return {
    name: 'babel-styled-components-dev',
    enforce: 'pre',
    apply: 'serve',
    configResolved(config) {
      root = config.root
    },
    async transform(code, id) {
      if (!/\.styled\.tsx(?:\?|$)/.test(id)) return
      const opts = getBabelOptions()
      const result = await babel.transformAsync(code, { ...opts, filename: id })
      if (!result) return
      return { code: result.code ?? '', map: result.map }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [styledComponentsDevPlugin(), react()],
  server: {
    open: true,
  },
  preview: {
    open: true,
  },
})

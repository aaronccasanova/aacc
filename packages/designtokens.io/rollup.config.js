import path from 'path'

import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'

import pkg from './package.json'

const name = 'designTokensIO'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

/** @type {import('rollup').RollupOptions['plugins']} */
const plugins = [
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  nodeResolve({ extensions }),
  commonjs(),
  babel({
    extensions,
    babelHelpers: 'bundled',
    include: ['src/**/*'],
  }),
]

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: 'src/index.ts',
    plugins,
    output: [
      {
        format: /** @type {const} */ ('cjs'),
        entryFileNames: '[name][assetExtname].js',
        dir: path.dirname(pkg.main),
        preserveModules: true,
      },
      {
        format: /** @type {const} */ ('es'),
        entryFileNames: '[name][assetExtname].mjs',
        dir: path.dirname(pkg.module),
        preserveModules: true,
      },
    ],
    external: Object.keys(pkg.dependencies),
  },
  {
    input: 'src/index.ts',
    plugins,
    output: {
      format: /** @type {const} */ ('iife'),
      file: pkg.browser,
      name,
    },
  },
]

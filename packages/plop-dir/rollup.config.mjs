import * as fs from 'node:fs'
import * as path from 'node:path'

import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pkg = JSON.parse(
  await fs.promises.readFile(
    new URL('./package.json', import.meta.url),
    'utf-8',
  ),
)

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
        entryFileNames: '[name].js',
        dir: path.dirname(pkg.main),
        preserveModules: true,
      },
      {
        format: /** @type {const} */ ('es'),
        entryFileNames: '[name].mjs',
        dir: path.dirname(pkg.module),
        preserveModules: true,
      },
    ],
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    external: Object.keys(pkg.dependencies ?? {}),
  },
]
import * as fs from 'node:fs'
import * as path from 'node:path'

/* eslint-disable import/no-extraneous-dependencies */
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
/* eslint-enable import/no-extraneous-dependencies */

/**
 * @type {import('./package.json')}
 */
const pkg = JSON.parse(
  await fs.promises.readFile(
    new URL('./package.json', import.meta.url),
    'utf-8',
  ),
)

const name = 'aaccRollupBabelJs'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: 'src/index.js',
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
    {
      format: /** @type {const} */ ('iife'),
      file: pkg.browser,
      name,

      // https://rollupjs.org/guide/en/#outputglobals
      // globals: {},
    },
  ],
  plugins: [
    // Allows node_modules resolution
    nodeResolve({ extensions }),
    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),
    // Compile TypeScript/JavaScript files
    babel({
      extensions,
      babelHelpers: 'bundled',
      include: ['src/**/*'],
    }),
  ],
  external: [
    ...Object.keys(pkg.dependencies ?? {}),
    // @ts-expect-error - Safe to ignore
    ...Object.keys(pkg.peerDependencies ?? {}),
  ],
}

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
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pkg = JSON.parse(
  await fs.promises.readFile(
    new URL('./package.json', import.meta.url),
    'utf-8',
  ),
)

const extensions = ['.js', '.jsx', '.ts', '.tsx']

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: ['src/index.ts', 'src/glob-worker.ts'],
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
  plugins: [
    // Allows node_modules resolution
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
  external: Object.keys(pkg.dependencies),
}

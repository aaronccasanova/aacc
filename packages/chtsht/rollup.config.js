import path from 'path'

import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import shebang from 'rollup-plugin-preserve-shebang'

import pkg from './package.json'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: 'src/cli.tsx',
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
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    shebang(),
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
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    ...Object.keys(pkg.peerDependencies ?? {}),
  ],
}

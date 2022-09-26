import * as url from 'node:url'
import * as path from 'node:path'

import { plopDir } from './packages/plop-dir/dist/esm/index.mjs'

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const libNamePrompt = {
  name: 'libName',
  message: 'Name of the lib (e.g. my-lib)',
}

const scopeNamePrompt = {
  name: 'scopeName',
  message: 'Optional registry scope name (e.g. @aacc)',
  suffix: ' Enter to skip',
  transform: (input) => (input.endsWith('/') ? input : `${input}/`),
}

const outputDirPrompt = {
  name: 'outputDir',
  message: 'Optional outputDir override',
  suffix: ' Enter to use default "packages" dir',
  default: 'packages',
}

/** @param {import('plop').NodePlopAPI} plop */
// eslint-disable-next-line import/no-default-export
export default async function run(plop) {
  plop.setGenerator(
    'rollup-babel-ts',
    await plopDir({
      plop,
      templateDir: path.join(__dirname, './templates/rollup-babel-ts'),
      outputDir: path.join(__dirname, '{{kebabCase outputDir}}'),
      prompts: [libNamePrompt, scopeNamePrompt, outputDirPrompt],
    }),
  )

  plop.setGenerator(
    'rollup-babel-tsx',
    await plopDir({
      plop,
      templateDir: path.join(__dirname, './templates/rollup-babel-tsx'),
      outputDir: path.join(__dirname, '{{kebabCase outputDir}}'),
      prompts: [libNamePrompt, scopeNamePrompt, outputDirPrompt],
    }),
  )
}

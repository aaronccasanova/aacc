import * as url from 'node:url'
import * as path from 'node:path'

import { plopDir } from './dist/esm/index.mjs'

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

/** @param {import('plop').NodePlopAPI} plop */
// eslint-disable-next-line import/no-default-export
export default async function run(plop) {
  plop.setGenerator(
    'my-generator',
    await plopDir({
      plop,
      // Path to my-generator templates
      templateDir: path.join(__dirname, './templates/my-generator'),
      // Path to output my-generator files
      outputDir: path.join(__dirname, './tmp'),
    }),
  )
}

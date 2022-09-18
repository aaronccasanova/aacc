import * as url from 'node:url'

import { plopDir } from './dist/esm/index.mjs'

/** @param {import('plop').NodePlopAPI} plop */
// eslint-disable-next-line import/no-default-export
export default async function generate(plop) {
  plop.setGenerator(
    'scss-migration',
    await plopDir({
      plop,
      templateDir: url.fileURLToPath(new URL('./templates', import.meta.url)),
      outputDir: url.fileURLToPath(new URL('./src/nested', import.meta.url)),
    }),
  )

  // plop.setGenerator(
  //   'typescript-migration',
  //   await plopDir(plop, {
  //     templateDir: url.fileURLToPath(new URL('./templates', import.meta.url)),
  //     outputDir: url.fileURLToPath(new URL('./src/nested', import.meta.url)),
  //   }),
  // )
}

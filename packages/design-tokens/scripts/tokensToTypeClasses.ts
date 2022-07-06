import * as fs from 'node:fs'
import * as path from 'node:path'

import type * as dt from 'designtokens.io'

import { prefix } from '../src'
import { toTypeClasses } from './toTypeClasses'
import { rootFontSizeRule } from './utils'

const outputDir = path.join(__dirname, '../dist/css')
const outputPath = path.join(outputDir, 'type-classes.css')

export async function tokensToTypeClasses(designTokens: dt.DesignTokens) {
  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir, { recursive: true })
  }

  await fs.promises.writeFile(
    outputPath,
    [
      rootFontSizeRule,
      toTypeClasses(designTokens, {
        prefix,
      }),
    ].join('\n\n'),
  )
}

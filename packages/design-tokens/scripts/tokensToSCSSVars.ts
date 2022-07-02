import * as fs from 'node:fs'
import * as path from 'node:path'

import * as dt from 'designtokens.io'

import { prefix } from '../src'

const outputDir = path.join(__dirname, '../dist/scss')
const outputPath = path.join(outputDir, 'design-token-vars.scss')

export async function tokensToSCSSVars(designTokens: dt.DesignTokens) {
  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir, { recursive: true })
  }

  await fs.promises.writeFile(
    outputPath,
    dt.toSCSSVars(designTokens, { prefix }),
  )
}

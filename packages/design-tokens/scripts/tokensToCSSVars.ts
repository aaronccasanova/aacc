import * as fs from 'node:fs'
import * as path from 'node:path'

import * as dt from 'designtokens.io'

const outputDir = path.join(__dirname, '../dist/css')
const outputPath = path.join(outputDir, 'design-token-vars.css')

export async function tokensToCSSVars(designTokens: dt.DesignTokens) {
  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir, { recursive: true })
  }

  await fs.promises.writeFile(
    outputPath,
    dt.toCSSVars(designTokens, { prefix: 'aacc' }),
  )
}

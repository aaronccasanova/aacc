import * as fs from 'fs'
import * as path from 'path'

import type * as tf from 'type-fest'
import type { DesignTokens } from '../src'

const outputDir = path.join(__dirname, '../dist/json')

export async function tokensToJSON(designTokens: DesignTokens) {
  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir, { recursive: true })
  }

  await Promise.all(
    Object.entries(designTokens).map(async (entry) => {
      const [tokenGroupName, tokenGroup] = entry as tf.Entry<DesignTokens>

      const filePath = path.join(outputDir, `${tokenGroupName}.json`)

      await fs.promises.writeFile(filePath, JSON.stringify(tokenGroup))
    }),
  )
}

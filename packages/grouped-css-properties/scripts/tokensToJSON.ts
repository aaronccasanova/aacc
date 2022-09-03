import * as fs from 'fs'
import * as path from 'path'

import type * as tf from 'type-fest'
import type { GroupedCSSProperties } from '../src'

const outputDir = path.join(__dirname, '../dist/json')

export async function tokensToJSON(groupedCSSProperties: GroupedCSSProperties) {
  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir, { recursive: true })
  }

  await Promise.all(
    Object.entries(groupedCSSProperties).map(async (entry) => {
      const [groupName, cssProperties] = entry as tf.Entry<GroupedCSSProperties>

      const filePath = path.join(outputDir, `${groupName}.json`)

      await fs.promises.writeFile(filePath, JSON.stringify(cssProperties))
    }),
  )
}

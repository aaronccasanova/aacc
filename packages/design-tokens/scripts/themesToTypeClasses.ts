import * as fs from 'node:fs'
import * as path from 'node:path'

import type * as tf from 'type-fest'

import { Themes, prefix } from '../src'
import { createCSSClass, rootFontSizeRule } from './utils'
import { toTypeClasses } from './toTypeClasses'

const outputDir = path.join(__dirname, '../dist/css')
const outputPath = path.join(outputDir, 'theme-type-classes.css')

export async function themesToTypeClasses(themes: Themes) {
  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir, { recursive: true })
  }

  const typeClasses = Object.entries(themes)
    .map((entry) => {
      const [themeKey, designTokens] = entry as tf.Entry<Themes>

      const themeClass = createCSSClass(themeKey, { prefix })

      return toTypeClasses(designTokens, {
        prefix,
        scopedClass: themeClass,
      })
    })
    .join('\n\n')

  await fs.promises.writeFile(
    outputPath,
    [rootFontSizeRule, typeClasses].join('\n\n'),
  )
}

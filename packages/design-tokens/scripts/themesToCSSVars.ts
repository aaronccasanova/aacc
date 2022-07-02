import * as fs from 'node:fs'
import * as path from 'node:path'

import type * as tf from 'type-fest'
import * as dt from 'designtokens.io'

import { Themes, prefix } from '../src'

const outputDir = path.join(__dirname, '../dist/css')
const outputPath = path.join(outputDir, 'theme-vars.css')

const toCSSVarsOptions = {
  prefix,
  selector: null,
  indent: ' '.repeat(2),
}

export async function themesToCSSVars(themes: Themes) {
  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir, { recursive: true })
  }

  const themeVars = /* css */ `
:root {
  color-scheme: var(--${prefix}-colors-scheme);
${dt.toCSSVars(themes.light, toCSSVarsOptions)}
}

@media (prefers-color-scheme: dark) {
  :root {
${dt.toCSSVars(themes.dark, { ...toCSSVarsOptions, indent: ' '.repeat(4) })}
  }
}

${Object.entries(themes)
  .map((entry) => {
    const [themeKey, designTokens] = entry as tf.Entry<Themes>

    const selector = `.${prefix}-${themeKey}`
    const cssVars = dt.toCSSVars(designTokens, toCSSVarsOptions)

    return `${selector} {\n${cssVars}\n}`
  })
  .join('\n\n')}
`

  await fs.promises.writeFile(outputPath, themeVars)
}

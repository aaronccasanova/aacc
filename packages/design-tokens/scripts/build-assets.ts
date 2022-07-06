import { designTokens, themes } from '../src'

import { themesToCSSVars } from './themesToCSSVars'
import { themesToThemeObjs } from './themesToThemeObjs'
import { themesToTypeClasses } from './themesToTypeClasses'
import { tokensToCSSVars } from './tokensToCSSVars'
import { tokensToJSON } from './tokensToJSON'
import { tokensToSCSSVars } from './tokensToSCSSVars'
import { tokensToTypeClasses } from './tokensToTypeClasses'

async function main() {
  await Promise.all([
    themesToCSSVars(themes),
    themesToThemeObjs(themes),
    themesToTypeClasses(themes),
    tokensToCSSVars(designTokens),
    tokensToJSON(designTokens),
    tokensToSCSSVars(designTokens),
    tokensToTypeClasses(designTokens),
  ])
}

main().catch((e) => {
  const errorMessage = 'Error in build-assets.ts'

  if (e instanceof Error) {
    throw new Error(`${errorMessage}: ${e.message}`)
  }

  throw new Error(errorMessage)
})

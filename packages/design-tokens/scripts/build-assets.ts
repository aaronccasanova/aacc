import { designTokens, themes } from '../src'

import { tokensToCSSVars } from './tokensToCSSVars'
import { tokensToSCSSVars } from './tokensToSCSSVars'
import { tokensToJSON } from './tokensToJSON'
import { themesToCSSVars } from './themesToCSSVars'
import { themesToThemeObjs } from './themesToThemeObjs'

async function main() {
  await Promise.all([
    tokensToCSSVars(designTokens),
    tokensToSCSSVars(designTokens),
    tokensToJSON(designTokens),
    themesToCSSVars(themes),
    themesToThemeObjs(themes),
  ])
}

main().catch((e) => {
  const errorMessage = 'Error in build-assets.ts'

  if (e instanceof Error) {
    throw new Error(`${errorMessage}: ${e.message}`)
  }

  throw new Error(errorMessage)
})

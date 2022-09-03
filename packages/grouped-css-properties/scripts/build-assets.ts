import { groupedCSSProperties } from '../src'

import { tokensToJSON } from './tokensToJSON'

async function main() {
  await tokensToJSON(groupedCSSProperties)
}

main().catch((e) => {
  const errorMessage = 'Error in build-assets.ts'

  if (e instanceof Error) {
    throw new Error(`${errorMessage}: ${e.message}`)
  }

  throw new Error(errorMessage)
})

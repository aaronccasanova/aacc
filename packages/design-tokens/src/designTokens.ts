import { createDesignTokens } from 'designtokens.io'

import { breakpoints } from './token-groups/breakpoints'
import { colors } from './token-groups/colors'
import { spacing } from './token-groups/spacing'

export const designTokens = createDesignTokens({
  breakpoints,
  colors,
  spacing,
})

export type DesignTokens = typeof designTokens

export type TokenGroupKey = keyof DesignTokens

export type TokenGroupKeys = TokenGroupKey[]

export const tokenGroupKeys = Object.keys(designTokens) as TokenGroupKeys

export function isTokenGroupKey(key: unknown): key is TokenGroupKey {
  return tokenGroupKeys.includes(key as TokenGroupKey)
}

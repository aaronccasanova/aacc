import { createDesignTokens } from 'designtokens.io'

import { breakpoints, colors, spacing, typography } from '../token-groups'

export const commonTheme = createDesignTokens({
  breakpoints,
  colors,
  spacing,
  typography,
})

import deepmerge from 'deepmerge'
import { createDesignTokens } from 'designtokens.io'

import { darkTheme } from './dark'

export type DimTheme = typeof dimTheme

export const dimTheme = createDesignTokens(
  deepmerge(darkTheme, {
    colors: {
      $description: 'Dim theme colors',
      $tokens: {
        background: {
          $description: 'Background colors.',
          $tokens: {
            default: { $value: '{colors.grey.800}' },
            surface: { $value: '{colors.grey.900}' },
          },
        },
      },
    },
  }),
)

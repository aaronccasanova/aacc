import deepmerge from 'deepmerge'
import { createDesignTokens } from 'designtokens.io'

import { commonTheme } from './common'

export type LightTheme = typeof lightTheme

export const lightTheme = createDesignTokens(
  deepmerge(commonTheme, {
    colors: {
      $description: 'Light theme colors.',
      $tokens: {
        scheme: {
          $description: 'Used to influence default browser styles.',
          $value: 'light',
        },
        primary: {
          $description: 'Primary theme colors.',
          $tokens: {
            main: { $value: '{colors.teal.500}' },
          },
        },
        background: {
          $description: 'Background colors.',
          $tokens: {
            default: { $value: '{colors.grey.100}' },
            surface: { $value: '{colors.grey.50}' },
          },
        },
        text: {
          $description: 'Text colors.',
          $tokens: {
            primary: { $value: '{colors.grey.900}' },
          },
        },
      },
    },
  }),
)

import { createDesignTokenGroup } from 'designtokens.io'

import { base } from './spacing'

export const shape = createDesignTokenGroup({
  $tokens: {
    borderRadius: {
      $tokens: {
        small: { $value: `${base}px` },
        medium: { $value: `${base * 2}px` },
        large: { $value: `${base * 2}px` },
      },
    },
  },
})

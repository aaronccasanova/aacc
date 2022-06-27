import { createDesignTokenGroup } from 'designtokens.io'

export const breakpoints = createDesignTokenGroup({
  $tokens: {
    xs: {
      $value: '0px',
    },
    sm: {
      $value: '600px',
    },
    md: {
      $value: '960px',
    },
    lg: {
      $value: '1200px',
    },
    xl: {
      $value: '1536px',
    },
  },
})

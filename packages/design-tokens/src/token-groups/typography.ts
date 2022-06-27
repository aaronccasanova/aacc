import { createDesignTokenGroup } from 'designtokens.io'

export const typography = createDesignTokenGroup({
  $tokens: {
    h1: {
      $value: {
        'font-family':
          '"PlusJakartaSans-ExtraBold",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
        'font-size': 'clamp(2.625rem, 1.2857rem + 3.5714vw, 4rem)',
        'font-weight': '800', // TODO: Allow numbers?
        'line-height': '1.1142857142857143',
      },
    },
    h2: {
      $value: {
        'font-family':
          '"PlusJakartaSans-ExtraBold",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"',
        'font-size': 'clamp(2.625rem, 1.2857rem + 3.5714vw, 4rem)',
        'font-weight': '800', // TODO: Allow numbers?
        'line-height': '1.1142857142857143',
      },
    },
  },
})

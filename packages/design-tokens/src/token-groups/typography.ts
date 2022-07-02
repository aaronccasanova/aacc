import { createDesignTokenGroup } from 'designtokens.io'

export const typography = createDesignTokenGroup({
  $tokens: {
    fontFamily: {
      $tokens: {
        sans: {
          // https://css-tricks.com/snippets/css/system-font-stack/#aa-method-1-system-fonts-at-the-element-level
          $value:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        },
        mono: {
          // https://github.com/Shopify/polaris/blob/a86272f248ce2ea61ca8be47f379303c59e92e73/polaris-tokens/src/token-groups/typography.ts#L8
          $value:
            'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        },
      },
    },
    h1: {
      $value: {
        'font-family': '{typography.fontFamily.sans}',
        'font-size': 'clamp(2.625rem, 1.2857rem + 3.5714vw, 4rem)',
        'font-weight': '800', // TODO: Allow numbers?
        'line-height': '1.1142857142857143',
      },
    },
    h2: {
      $value: {
        'font-family': '{typography.fontFamily.sans}',
        'font-size': 'clamp(2.625rem, 1.2857rem + 3.5714vw, 4rem)',
        'font-weight': '800', // TODO: Allow numbers?
        'line-height': '1.1142857142857143',
      },
    },
  },
})

import { createDesignTokenGroup } from 'designtokens.io'

export const typography = createDesignTokenGroup({
  $tokens: {
    fontSize: {
      $tokens: {
        // https://www.fluid-type-scale.com/calculate?minFontSize=16&minWidth=600&minRatio=1.060&maxFontSize=18&maxWidth=1536&maxRatio=1.115&steps=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9&baseStep=0&prefix=font-size&decimals=2&useRems=on&previewFont=Inter
        base: { $value: '16px' },
        0: { $value: 'clamp(1rem, 0.21vw + 0.92rem, 1.13rem)' },
        1: { $value: 'clamp(1.06rem, 0.33vw + 0.94rem, 1.25rem)' },
        2: { $value: 'clamp(1.12rem, 0.47vw + 0.95rem, 1.4rem)' },
        3: { $value: 'clamp(1.19rem, 0.63vw + 0.95rem, 1.56rem)' },
        4: { $value: 'clamp(1.26rem, 0.81vw + 0.96rem, 1.74rem)' },
        5: { $value: 'clamp(1.34rem, 1.03vw + 0.95rem, 1.94rem)' },
        6: { $value: 'clamp(1.42rem, 1.27vw + 0.94rem, 2.16rem)' },
        7: { $value: 'clamp(1.5rem, 1.55vw + 0.92rem, 2.41rem)' },
        8: { $value: 'clamp(1.59rem, 1.87vw + 0.89rem, 2.69rem)' },
        9: { $value: 'clamp(1.69rem, 2.23vw + 0.85rem, 3rem)' },
      },
    },
    fontFamily: {
      $tokens: {
        sans: {
          // https://css-tricks.com/snippets/css/system-font-stack/#aa-method-1-system-fonts-at-the-element-level
          $value:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        },
      },
    },
    // https://design-tokens.github.io/community-group/format/#typography
    h1: {
      $type: 'typography',
      $value: {
        fontFamily: '{typography.fontFamily.sans}',
        fontSize: '{typography.fontSize.8}',
        fontWeight: '800',
        lineHeight: '1.5',
      },
    },
    h2: {
      $type: 'typography',
      $value: {
        fontFamily: '{typography.fontFamily.sans}',
        fontSize: '{typography.fontSize.7}',
        fontWeight: '800',
        lineHeight: '1.5',
      },
    },
    h3: {
      $type: 'typography',
      $value: {
        fontFamily: '{typography.fontFamily.sans}',
        fontSize: '{typography.fontSize.6}',
        fontWeight: '700',
        lineHeight: '1.5',
      },
    },
    h4: {
      $type: 'typography',
      $value: {
        fontFamily: '{typography.fontFamily.sans}',
        fontSize: '{typography.fontSize.5}',
        fontWeight: '700',
        lineHeight: '1.5',
      },
    },
    h5: {
      $type: 'typography',
      $value: {
        fontFamily: '{typography.fontFamily.sans}',
        fontSize: '{typography.fontSize.4}',
        fontWeight: '600',
        lineHeight: '1.5',
      },
    },
    h6: {
      $type: 'typography',
      $value: {
        fontFamily: '{typography.fontFamily.sans}',
        fontSize: '{typography.fontSize.3}',
        fontWeight: '600',
        lineHeight: '1.5',
      },
    },
    bodyLarge: {
      $type: 'typography',
      $value: {
        fontFamily: '{typography.fontFamily.sans}',
        fontSize: '{typography.fontSize.3}',
        fontWeight: '400',
        lineHeight: '1.5',
      },
    },
    bodyMedium: {
      $type: 'typography',
      $value: {
        fontFamily: '{typography.fontFamily.sans}',
        fontSize: '{typography.fontSize.2}',
        fontWeight: '400',
        lineHeight: '1.5',
      },
    },
    bodySmall: {
      $type: 'typography',
      $value: {
        fontFamily: '{typography.fontFamily.sans}',
        fontSize: '{typography.fontSize.1}',
        fontWeight: '400',
        lineHeight: '1.5',
      },
    },
    buttonLarge: {
      $type: 'typography',
      $value: {
        fontFamily: '{typography.fontFamily.sans}',
        fontSize: '{typography.fontSize.3}',
        fontWeight: '400',
        lineHeight: '1.5',
      },
    },
    buttonMedium: {
      $type: 'typography',
      $value: {
        fontFamily: '{typography.fontFamily.sans}',
        fontSize: '{typography.fontSize.2}',
        fontWeight: '400',
        lineHeight: '1.5',
      },
    },
    buttonSmall: {
      $type: 'typography',
      $value: {
        fontFamily: '{typography.fontFamily.sans}',
        fontSize: '{typography.fontSize.1}',
        fontWeight: '400',
        lineHeight: '1.5',
      },
    },
  },
})

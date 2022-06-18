import { createDesignTokens } from '../../utils'
import { toCSSVars } from '../toCSSVars'

const designTokens = createDesignTokens({
  tokenName1: {
    $value: 'one',
  },
  tokenGroup: {
    $tokens: {
      tokenName2: {
        $value: 'two',
      },
    },
  },
  tokenAlias: {
    $value: '{tokenGroup.tokenName2}',
  },
})

const cssVarsFixture = `
--tokenName1: one;
--tokenGroup-tokenName2: two;
--tokenAlias: var(--tokenGroup-tokenName2);
`.trim()

const defaultCSSVarsFixture = `
:root {
  --tokenName1: one;
  --tokenGroup-tokenName2: two;
  --tokenAlias: var(--tokenGroup-tokenName2);
}`.trim()

const customCSSVarsFixture = `
.custom {
  --tokenName1: one;
  --tokenGroup-tokenName2: two;
  --tokenAlias: var(--tokenGroup-tokenName2);
}`.trim()

const prefixedCSSVarsFixture = `
:root {
  --dt-tokenName1: one;
  --dt-tokenGroup-tokenName2: two;
  --dt-tokenAlias: var(--dt-tokenGroup-tokenName2);
}`.trim()

describe('toCSSVars', () => {
  it('transforms design tokens to css vars in a :root selector', () => {
    expect(toCSSVars(designTokens)).toBe(defaultCSSVarsFixture)
  })

  it('transforms design tokens to css vars in a custom selector', () => {
    expect(toCSSVars(designTokens, { selector: '.custom' })).toBe(
      customCSSVarsFixture,
    )
  })

  it('transforms design tokens to css vars without a selector', () => {
    expect(toCSSVars(designTokens, { selector: null })).toBe(cssVarsFixture)
  })

  it('transforms design tokens to prefixed css vars', () => {
    expect(toCSSVars(designTokens, { prefix: 'dt' })).toBe(
      prefixedCSSVarsFixture,
    )
  })
})

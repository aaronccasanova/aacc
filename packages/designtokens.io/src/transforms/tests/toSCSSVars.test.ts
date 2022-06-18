import { createDesignTokens } from '../../utils'
import { toSCSSVars } from '../toSCSSVars'

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

const scssVarsFixture = `
$tokenName1: one;
$tokenGroup-tokenName2: two;
$tokenAlias: $tokenGroup-tokenName2;
`.trim()

const prefixedSCSSVarsFixture = `
$dt-tokenName1: one;
$dt-tokenGroup-tokenName2: two;
$dt-tokenAlias: $dt-tokenGroup-tokenName2;
`.trim()

describe('toSCSSVars', () => {
  it('transforms design tokens to scss vars', () => {
    expect(toSCSSVars(designTokens)).toBe(scssVarsFixture)
  })

  it('transforms design tokens to prefixed scss vars', () => {
    expect(toSCSSVars(designTokens, { prefix: 'dt' })).toBe(
      prefixedSCSSVarsFixture,
    )
  })
})

import { createDesignTokens } from '../../utils'
import { toSCSSVars } from '../toSCSSVars'

const designTokens = createDesignTokens({
  tokenName1: {
    $value: 't1',
  },
  tokenAlias: {
    $value: '{tokenGroup.tokenName2}',
  },
  tokenComposite: {
    $value: {
      property1: 'p1',
      property2: '{tokenGroup.tokenName2}',
    },
  },
  tokenGroup: {
    $tokens: {
      tokenName2: {
        $value: 't2',
      },
    },
  },
})

const scssVarsFixture = `
$tokenName1: t1;
$tokenAlias: $tokenGroup-tokenName2;
$tokenComposite-property1: p1;
$tokenComposite-property2: $tokenGroup-tokenName2;
$tokenGroup-tokenName2: t2;
`.trim()

const prefixedSCSSVarsFixture = `
$dt-tokenName1: t1;
$dt-tokenAlias: $dt-tokenGroup-tokenName2;
$dt-tokenComposite-property1: p1;
$dt-tokenComposite-property2: $dt-tokenGroup-tokenName2;
$dt-tokenGroup-tokenName2: t2;
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

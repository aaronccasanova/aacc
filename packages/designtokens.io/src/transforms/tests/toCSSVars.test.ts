import { createDesignTokens } from '../../utils'
import { toCSSVars } from '../toCSSVars'

const designTokens = createDesignTokens({
  tokenName1: {
    $value: 't1',
  },
  tokenAlias: {
    $value: '{tokenGroup.tokenName2}',
  },
  tokenComposite: {
    $value: {
      property1: 'p2',
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

const cssVarsFixture = `
--tokenName1: t1;
--tokenAlias: var(--tokenGroup-tokenName2);
--tokenComposite-property1: p2;
--tokenComposite-property2: var(--tokenGroup-tokenName2);
--tokenGroup-tokenName2: t2;
`.trim()

const indent = ' '.repeat(2)

const indentedCSSVarsFixture = `${indent}--tokenName1: t1;
${indent}--tokenAlias: var(--tokenGroup-tokenName2);
${indent}--tokenComposite-property1: p2;
${indent}--tokenComposite-property2: var(--tokenGroup-tokenName2);
${indent}--tokenGroup-tokenName2: t2;`

const defaultCSSVarsFixture = `
:root {
  --tokenName1: t1;
  --tokenAlias: var(--tokenGroup-tokenName2);
  --tokenComposite-property1: p2;
  --tokenComposite-property2: var(--tokenGroup-tokenName2);
  --tokenGroup-tokenName2: t2;
}`.trim()

const customCSSVarsFixture = `
.custom {
  --tokenName1: t1;
  --tokenAlias: var(--tokenGroup-tokenName2);
  --tokenComposite-property1: p2;
  --tokenComposite-property2: var(--tokenGroup-tokenName2);
  --tokenGroup-tokenName2: t2;
}`.trim()

const prefixedCSSVarsFixture = `
:root {
  --dt-tokenName1: t1;
  --dt-tokenAlias: var(--dt-tokenGroup-tokenName2);
  --dt-tokenComposite-property1: p2;
  --dt-tokenComposite-property2: var(--dt-tokenGroup-tokenName2);
  --dt-tokenGroup-tokenName2: t2;
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

  it('transforms design tokens to indented css vars without a selector', () => {
    expect(toCSSVars(designTokens, { selector: null, indent })).toBe(
      indentedCSSVarsFixture,
    )
  })

  it('transforms design tokens to prefixed css vars', () => {
    expect(toCSSVars(designTokens, { prefix: 'dt' })).toBe(
      prefixedCSSVarsFixture,
    )
  })
})

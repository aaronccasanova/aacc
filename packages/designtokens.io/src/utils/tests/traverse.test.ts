import { createDesignTokens } from '../creators'
import {
  traverse,
  isDesignToken,
  isAliasToken,
  isCompositeToken,
  isTokenGroup,
  getAliasPath,
  getAliasRawPath,
  getAliasValue,
} from '../traverse'

const designTokens = createDesignTokens({
  tokenName1: {
    $value: 'one',
  },
  tokenAlias: {
    $value: '{tokenGroup.tokenName2}',
  },
  tokenComposite: {
    $value: {
      tokenName3: 'three',
    },
  },
  tokenGroup: {
    $tokens: {
      tokenName2: {
        $value: 'two',
      },
    },
  },
})

describe('traverse', () => {
  it('visits every node in a design tokens object and executes a callback', () => {
    const tokens: string[] = []
    const aliases: string[] = []
    const composites: string[] = []
    const groups: string[] = []

    traverse(designTokens, {
      onToken: (_, ctx) => tokens.push(ctx.name),
      onAlias: (_, ctx) => aliases.push(ctx.name),
      onComposite: (_, ctx) => composites.push(ctx.name),
      onGroup: (_, ctx) => groups.push(ctx.name),
    })

    expect(tokens).toStrictEqual(['tokenName1', 'tokenName2'])
    expect(aliases).toStrictEqual(['tokenAlias'])
    expect(composites).toStrictEqual(['tokenComposite'])
    expect(groups).toStrictEqual(['tokenGroup'])
  })
})

const designTokenFixture = {
  $value: 'foo',
}

const aliasTokenFixture = {
  $value: '{foo.bar}',
}

const compositeTokenFixture = {
  $value: {
    foo: 'bar',
  },
}

const tokenGroupFixture = {
  $tokens: {
    foo: {
      $value: 'bar',
    },
  },
}

describe('isDesignToken type-guard', () => {
  it('determines if a node is a design token', () => {
    expect(isDesignToken(designTokenFixture)).toBe(true)
    expect(isDesignToken(aliasTokenFixture)).toBe(false)
    expect(isDesignToken(compositeTokenFixture)).toBe(false)
    expect(isDesignToken(tokenGroupFixture)).toBe(false)
  })
})

describe('isAliasToken type-guard', () => {
  it('determines if a node is a alias token', () => {
    expect(isAliasToken(designTokenFixture)).toBe(false)
    expect(isAliasToken(aliasTokenFixture)).toBe(true)
    expect(isAliasToken(compositeTokenFixture)).toBe(false)
    expect(isAliasToken(tokenGroupFixture)).toBe(false)
  })
})

describe('isCompositeToken type-guard', () => {
  it('determines if a node is a composite token', () => {
    expect(isCompositeToken(designTokenFixture)).toBe(false)
    expect(isCompositeToken(aliasTokenFixture)).toBe(false)
    expect(isCompositeToken(compositeTokenFixture)).toBe(true)
    expect(isCompositeToken(tokenGroupFixture)).toBe(false)
  })
})

describe('isTokenGroup type-guard', () => {
  it('determines if a node is a token group', () => {
    expect(isTokenGroup(designTokenFixture)).toBe(false)
    expect(isTokenGroup(aliasTokenFixture)).toBe(false)
    expect(isTokenGroup(compositeTokenFixture)).toBe(false)
    expect(isTokenGroup(tokenGroupFixture)).toBe(true)
  })
})

describe('getAliasPath', () => {
  it('returns the path of the alias token value', () => {
    expect(getAliasPath(aliasTokenFixture)).toStrictEqual(['foo', 'bar'])
  })
})

describe('getRawAliasPath', () => {
  it('returns the raw path of the alias token value', () => {
    expect(getAliasRawPath(aliasTokenFixture)).toStrictEqual([
      'foo',
      '$tokens',
      'bar',
    ])
  })
})

describe('getAliasValue', () => {
  it('returns the design token referenced in the alias token value', () => {
    expect(getAliasValue(designTokens.tokenAlias, designTokens)).toStrictEqual({
      $value: 'two',
    })
  })
})

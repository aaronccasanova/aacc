import { createDesignTokens } from '../creators'
import { traverse } from '../traverse'

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

describe('traverse', () => {
  it('visits every node in a design tokens object and executes a callback', () => {
    const tokens: string[] = []
    const aliases: string[] = []
    const groups: string[] = []

    traverse(designTokens, {
      onToken: (_, ctx) => tokens.push(ctx.name),
      onAlias: (_, ctx) => aliases.push(ctx.name),
      onGroup: (_, ctx) => groups.push(ctx.name),
    })

    expect(tokens).toStrictEqual(['tokenName1', 'tokenName2'])
    expect(aliases).toStrictEqual(['tokenAlias'])
    expect(groups).toStrictEqual(['tokenGroup'])
  })
})

# designtokens.io

A collection of transforms and utilities for design tokens.

> Note: This library expects design tokens to be formatted in accordance with
> the
> [Design Tokens Format Module](https://design-tokens.github.io/community-group/format/).
> The only divergence is `Token Groups` have an intermediary `$tokens` property
> which helps TypeScript distinguish between `Tokens` and `Token Groups` and
> thus provides the most accurate type checking and inference.

## Installation

```sh
npm i designtokens.io
```

## Usage

Create design tokens

```js
import { createDesignTokens } from 'designtokens.io'

const designTokens = createDesignTokens({
  tokenName: {
    $value: 'Token value',
  },
  tokenGroup: {
    $description: 'Token group description',
    $tokens: {
      tokenName: {
        $value: 'Token value',
      },
    },
  },
  tokenAlias: {
    $value: '{tokenGroup.tokenName}',
  },
})
```

> If you are using TypeScript, `createTokens` will validate input tokens match
> the `DesignTokens` structure exactly and infer all members. This results in
> rich intellisense and type checking e.g.
> `tokens.tokenGroup.$tokens.tokenName.$value`

Transform design tokens to CSS variables

```js
import fs from 'fs'
import { toCSSVars } from 'designtokens.io'
import { designTokens } from './designTokens'

await fs.promises.writeFile('design-tokens.css', toCSSVars(designTokens))
```

Transform design tokens to SCSS variables

```js
import fs from 'fs'
import { toSCSSVars } from 'designtokens.io'
import { designTokens } from './designTokens'

await fs.promises.writeFile('design-tokens.scss', toSCSSVars(designTokens))
```

Create your own transform

```ts
import { traverse, DesignTokens } from 'designtokens.io'

export const toDocs = (designTokens: DesignTokens) => {
  const tokens: string[] = []

  traverse(designTokens, {
    onToken: (token, ctx) => {},
    onAlias: (alias, ctx) => {},
  })

  return tokens.join('\n')
}

// Usage:
import { designTokens } from './designTokens'
```

# designtokens.io

A collection of transforms and utilities for design tokens.

> Note: This library expects design tokens to be formatted in accordance with
> the
> [Design Tokens Format Module](https://design-tokens.github.io/community-group/format/).
> The main divergence is `Token Groups` have an intermediary `$tokens` property
> which helps TypeScript distinguish between `Tokens` and `Token Groups`,
> accurately validate token types, and infer design tokens. (See
> `createDesignTokens` in the `Usage` section.)

## Installation

```sh
npm i designtokens.io
```

## Usage

#### Create design tokens

```js
import { createDesignTokens } from 'designtokens.io'

const designTokens = createDesignTokens({
  tokenName: {
    $description: 'Design token description',
    $value: 'foo',
  },
  tokenAlias: {
    $description: 'Alias token description',
    $value: '{tokenGroup.tokenName}',
  },
  tokenGroup: {
    $description: 'Token group description',
    $tokens: {
      tokenName: {
        $description: 'Grouped token description',
        $value: 'bar',
      },
    },
  },
})
```

> If you are using TypeScript, `createDesignTokens` will validate input tokens
> match the `DesignTokens` interface exactly and infer all members. This results
> in rich intellisense and type checking e.g.
> `tokens.tokenGroup.$tokens.tokenName.$value`

> Note: There are identity function for each token type, e.g.
> `createDesignTokens`, `createDesignToken`, `createDesignTokenAlias`,
> `createDesignTokenComposite`, and `createDesignTokenGroup`.

#### Transform design tokens to CSS variables

```js
import * as fs from 'fs'
import { toCSSVars } from 'designtokens.io'
import { designTokens } from './designTokens'

await fs.promises.writeFile('design-tokens.css', toCSSVars(designTokens))
```

<details>
  <summary>Example output of <code>toCSSVars</code></summary>

```css
:root {
  --tokenName: foo;
  --tokenAlias: var(--tokenGroup-tokenName);
  --tokenGroup-tokenName: bar;
}
```

</details>

#### Transform design tokens to SCSS variables

```js
import * as fs from 'fs'
import { toSCSSVars } from 'designtokens.io'
import { designTokens } from './designTokens'

await fs.promises.writeFile('design-tokens.scss', toSCSSVars(designTokens))
```

<details>
  <summary>Example output of <code>toSCSSVars</code></summary>

```scss
$tokenName: foo;
$tokenAlias: $tokenGroup-tokenName;
$tokenGroup-tokenName: bar;
```

</details>

Create your own transform

```ts
import { traverse, DesignTokens } from 'designtokens.io'

interface ToDocsOptions {
  title: string
}

export function toDocs(designTokens: DesignTokens, options: ToDocsOptions) {
  const sections = [`# ${options.title}`]

  function createSection(token, ctx) {
    const isAliasToken = ctx.isAliasToken(token)

    return [
      `## ${ctx.path.join('.')}`,
      token.$description && `> ${token.$description}`,
      `**Value:** ${
        isAliasToken
          ? ctx.getTokenFromAlias(token, ctx.tokens).$value
          : token.$value
      }`,
      isAliasToken && `**Alias:** ${token.$value}`,
    ]
      .filter(Boolean)
      .join('\n\n')
  }

  traverse(designTokens, {
    onToken: (token, ctx) => {
      sections.push(createSection(token, ctx))
    },
    onAlias: (alias, ctx) => {
      sections.push(createSection(alias, ctx))
    },
  })

  return sections.join('\n\n\n')
}

// Usage:
import * as fs from 'fs'
import { designTokens } from './designTokens'
import { toDocs } from './toDocs'

await fs.promises.writeFile(
  'design-tokens.md',
  toDocs(designTokens, {
    title: 'Design Tokens',
  }),
)
```

<details>
  <summary>Example output of <code>toDocs</code></summary>

# Design Tokens

## tokenName

> Design token description

**Value:** foo

## tokenAlias

> Alias token description

**Value:** bar

**Alias:** {tokenGroup.tokenName}

## tokenGroup.tokenName

> Grouped token description

**Value:** bar

</details>

## API

### `traverse(designTokens: DesignTokens, options: TraverseOptions)`

Traverses the design tokens and executes synchronous callbacks for each token
type defined in the options config.

- `designTokens`: The design tokens to traverse.
- `options`: The traversal options.
  - `onToken(token: DesignToken, context: TraverseContext)`: Callback executed
    when a design token is visited.
    - `token`: A reference to the design token object.
    - `context`: An object containing metadata and helper methods.
  - `onAlias(alias: DesignTokenAlias, context: TraverseContext)`: Callback
    executed when an alias token is visited.
    - `alias`: A reference to the alias token object.
    - `context`: An object containing metadata and helper methods.
  - `onComposite(composite: DesignTokenComposite, context: TraverseContext)`:
    Callback executed when a composite token is visited.
    - `composite`: A reference to the composite token object.
    - `context`: An object containing metadata and helper methods.
  - `onTokenGroup(tokenGroup: DesignTokenGroup, context: TraverseContext)`:
    Callback executed when a token group is visited.
    - `tokenGroup`: A reference to the token group object.
    - `context`: An object containing metadata and helper methods.

### `TraverseContext`

An object provided to each visitor callback in `TraverseOptions` containing
helper methods and metadata about the current token.

- `name`: Name of the current token, alias, composite or token group.
- `tokens`: A reference to the root design tokens object.
- `path`: An array of token names leading to the current token.
  - Note: This path has been filtered to exclude the `$tokens` property. Helpful
    for composing token names such as CSS custom properties.
- `rawPath`: An array of token names leading to the current token.
  - Note: This path has not been filtered and contains the full path to the
    current token from the root of the design tokens object. Helpful for
    resolving an alias token's `$value` property.
- `getPathFromAlias(alias: DesignTokenAlias)`: Retrieves the path to the token
  referenced in the alias token `$value`.
- `getTokenFromAlias(alias: DesignTokenAlias)`: Retrieves the raw path to the
  token referenced in the alias token `$value`.
- `getTokenFromAlias(alias: DesignTokenAlias, tokens: DesignTokens)`: Retrieves
  the token referenced in the alias token `$value` from the design tokens
  object.
- `isDesignToken(tokenOrGroup: unknown)`: Type guard returning `true` if the
  input is a design token.
- `isDesignTokenValue(value: unknown)`: Type guard returning `true` if the input
  is a valid design token value.
- `isAliasToken(tokenOrGroup: unknown)`: Type guard returning `true` if the
  input is an alias token.
- `isAliasTokenValue(value: unknown)`: Type guard returning `true` if the input
  is a valid alias token value.
- `isCompositeToken(tokenOrGroup: unknown)`: Type guard returning `true` if the
  input is a composite token.
- `isTokenGroup(tokenOrGroup: unknown)`: Type guard returning `true` if the
  input is a token group.

### `toCSSVars(designTokens: DesignTokens, options: ToCSSVarsOptions): string`

- `designTokens`: The design tokens to transform.
- `options`: The transformation options.
  - `selector`: The selector wrapping the CSS variables. Set to `null` to
    disable.
  - `prefix`: The prefix added to each CSS variable.
  - `delimiter`: The delimiter used when joining a design token path to create
    CSS variable names. Defaults to `-`.
  - `indent`: The indentation used for each CSS variable when wrapped in a
    `selector`. Defaults to 2 space characters.

### `toSCSSVars(designTokens: DesignTokens, options: ToSCSSVarsOptions): string`

- `designTokens`: The design tokens to transform.
- `options`: The options config.
  - `prefix`: The prefix added to each SCSS variable name.
  - `delimiter`: The delimiter used when joining a design token path to create
    SCSS variable names. Defaults to `-`.

### `createCSSVar(path: string[], options: CreatorOptions): string)`

Creates a CSS custom property name from an array of names leading to a design
token.

- `path`: An array of names leading to a design token.
- `options`: The creator options.
  - `prefix`: The prefix added to each CSS variable.
  - `delimiter`: The delimiter used when joining a design token path to create
    CSS variable names. Defaults to `-`.

```js
createCSSVar(['colors', 'blue', '500'], { prefix: 'dt' }) // '--dt-colors-blue-500'
```

### `cssVarCreator(options: CreatorOptions): (path: string[]) => string`

Higher order function to create prefixed CSS custom properties.

```js
const createCSSVar = cssVarCreator({ prefix: 'dt', delimiter: '_' })
createCSSVar(['colors', 'blue', '500']) // '--dt_colors_blue_500'
createCSSVar(['colors', 'red', '500']) // '--dt_colors_red_500'
```

### `createSCSSVar(path: string[], options: CreatorOptions): string)`

Creates a SCSS variable name from an array of names leading to a design token.

- `path`: An array of names leading to a design token.
- `options`: The creator options.
  - `prefix`: The prefix added to each SCSS variable.
  - `delimiter`: The delimiter used when joining a design token path to create
    SCSS variable names. Defaults to `-`.

```js
createSCSSVar(['colors', 'blue', '500'], { prefix: 'dt' }) // '$dt-colors-blue-500'
```

### `scssVarCreator(options: CreatorOptions): (path: string[]) => string`

Higher order function to create prefixed SCSS custom properties.

```js
const createSCSSVar = scssVarCreator({ prefix: 'dt', delimiter: '_' })
createSCSSVar(['colors', 'blue', '500']) // '$dt_colors_blue_500'
createSCSSVar(['colors', 'red', '500']) // '$dt_colors_red_500'
```

import type {
  ParseDesignTokenOrGroup,
  ParseDesignTokens,
  ParseDesignToken,
  ParseDesignTokenBase,
  ParseDesignTokenAlias,
  ParseDesignTokenComposite,
  ParseDesignTokenGroup,
  JsonObject,
  ExtractDesignTokenBase,
  ExtractDesignTokenValue,
  ExtractDesignTokenAlias,
} from '../types'

type WalkContext = {
  path: string[]
}

type WalkCallback = (node: JsonObject, context: WalkContext) => void

function walk<T>(tokens: ParseDesignTokens<T>, cb: WalkCallback) {
  function walkInner(
    tokensInner: JsonObject,
    cbInner: WalkCallback,
    _path: string[] = [],
  ) {
    for (const [key, n] of Object.entries(tokensInner)) {
      if (typeof n === 'object' && n !== null) {
        const node = n as JsonObject

        const path = [..._path, key]
        cbInner(node, { path })
        walkInner(node, cb, path)
      }
    }
  }

  // TODO: Try to remove this cast..
  walkInner(tokens as JsonObject, cb)
}

export interface TraverseOptions<T> {
  onToken?: (
    token: ExtractDesignTokenBase<T>,
    context: TraverseContext<T>,
  ) => void
  // onAlias?: (alias: T, context: TraverseContext<T>) => void
  // onComposite?: (composite: T, context: TraverseContext<T>) => void
  // onGroup?: (group: T, context: TraverseContext<T>) => void
}

export function traverse<T>(
  tokens: ParseDesignTokens<T>,
  options: TraverseOptions<T>,
): void {
  walk(tokens, (node, context) => {
    if (isDesignToken(node)) {
      // Design token

      options?.onToken?.(node, createContext({ tokens, context }))
    }
    // } else if (isAliasToken(node)) {
    // //   // Alias token
    // //   options?.onAlias?.(node, createContext({ tokens, context }))
    // // } else if (isCompositeToken(node)) {
    // //   // Composite token
    // //   options?.onComposite?.(node, createContext({ tokens, context }))
    // // } else if (isTokenGroup(node)) {
    // //   // Token group
    // //   options?.onGroup?.(node, createContext({ tokens, context }))
    // // }
  })
}

traverse(
  {
    $description: 'hi',
    token: {
      $value: 'hi',
    },
    // token2: {
    //   $value: 4,
    // },
    // tokens: {
    //   token: {
    //     $value: 'by',
    //   },
    // },
  },
  {
    onToken: (token, context) => {
      const val = token.$value

      console.log(val)
    },
  },
)

// function getDesignTokenTypeGuards<T>(tokens: ParseDesignTokens<T>) {
//   return {
//     isDesignToken: token => isDesignToken<ExtractDesignTokenBase<T>>(token),
//     isAliasToken: isAliasToken<ExtractDesignTokenAlias<T>>(tokens),
//     isDesignToken: isDesignTokenValue<ExtractDesignTokenValue<T>>(tokens),
//     isDesignToken: isDesignTokenValue<ExtractDesignTokenValue<T>>(tokens),
//   }
// }

export function isDesignTokenValue(value: unknown) {
  if (typeof value === 'number') return true

  if (typeof value === 'string' && !value.startsWith('{')) {
    return true
  }

  return false
}

export function isDesignToken(tokenOrGroup: unknown) {
  if (!Object.hasOwnProperty.call(tokenOrGroup, '$value')) return false

  return isDesignTokenValue((tokenOrGroup as { $value: any }).$value)
}

export function isAliasTokenValue<T>(value: unknown): value is T {
  if (typeof value === 'string' && value.startsWith('{')) {
    return true
  }

  return false
}

export function isAliasToken<T>(tokenOrGroup: unknown): tokenOrGroup is T {
  if (!Object.hasOwnProperty.call(tokenOrGroup, '$value')) return false

  return isAliasTokenValue((tokenOrGroup as { $value: any }).$value)
}

export function isCompositeToken<T>(tokenOrGroup: unknown): tokenOrGroup is T {
  if (!Object.hasOwnProperty.call(tokenOrGroup, '$value')) return false

  const tokenOrComposite = tokenOrGroup as { $value: any }

  if (
    typeof tokenOrComposite.$value === 'object' &&
    tokenOrComposite.$value !== null
  ) {
    return true
  }

  return false
}

export function isTokenGroup<T>(tokenOrGroup: unknown): tokenOrGroup is T {
  // TODO: This ain't right.. composite tokens would also match
  return !(tokenOrGroup as { $value: any })?.$value
}

export interface TraverseContext<T> {
  /**
   * Name of the current token, alias, or group.
   *
   * Note: This is a convenience property that is equivalent to `path[path.length - 1]`.
   */
  name: string
  /**
   * Reference to the root design tokens object.
   */
  tokens: T
  /**
   * An array of token names leading to the current token.
   *
   * Note: This path has been filtered to exclude the `$tokens` property.
   * Helpful for composing token names such as CSS custom properties.
   */
  // path: string[]
  /**
   * Raw path of the current token, alias, or group.
   *
   * Note: This path has not been filtered and contains the full path to
   * the current token from the root of the design tokens object.
   * Helpful for resolving an alias token's `$value` property.
   */
  // rawPath: string[]
  /**
   * Retrieves the path to the token referenced in the alias token $value.
   *
   * Note: This path has been filtered to exclude the `$tokens` property.
   * Helpful for composing token names such as CSS custom properties.
   */
  // getPathFromAlias: (aliasToken: DesignTokenAlias) => string[]
  /**
   * Retrieves the raw path to the token referenced in an alias token $value
   *
   * Note: This path has not been filtered and contains the full path to
   * the current token from the root of the design tokens object.
   * Helpful for resolving an alias token's `$value` property.
   */
  // getRawPathFromAlias: (aliasToken: DesignTokenAlias) => string[]
  /**
   * Retrieves the token referenced in the alias token $value from the design tokens object.
   */
  // getTokenFromAlias: (
  //   aliasToken: DesignTokenAlias,
  //   tokens: DesignTokens,
  // ) => AllDesignTokens
  // isDesignToken: typeof isDesignToken
  // isDesignTokenValue: typeof isDesignTokenValue
  // isAliasToken: typeof isAliasToken
  // isAliasTokenValue: typeof isAliasTokenValue
  // isCompositeToken: typeof isCompositeToken
  // isTokenGroup: typeof isTokenGroup
}

interface CreateContextOptions<T> {
  tokens: ParseDesignTokens<T>
  context: WalkContext
}

function createContext<T>(
  options: CreateContextOptions<T>,
): TraverseContext<T> {
  return {
    name: options.context.path[options.context.path.length - 1]!,
    tokens: options.tokens,
    // path: options.context.path.filter((p) => p !== '$tokens'),
    // rawPath: options.context.path,
    // getPathFromAlias,
    // getRawPathFromAlias,
    // getTokenFromAlias,
    // isDesignToken,
    // isDesignTokenValue,
    // isAliasToken,
    // isAliasTokenValue,
    // isCompositeToken,
    // isTokenGroup,
  }
}

/**
 * Retrieves the path to the token referenced in an alias token $value.
 *
 * @example
 * const alias = { $value: '{colors.blue.500}'}
 * ctx.getPathFromAlias(alias) // ['colors', 'blue', '500]
 */
// export function getPathFromAlias(aliasToken: DesignTokenAlias) {
//   if (!isAliasToken(aliasToken)) {
//     throw new Error('`getPathFromAlias` can only be called on an alias token.')
//   }

//   return aliasToken.$value.trim().slice(1, -1).split('.')
// }

/**
 * Retrieves the raw path to the token referenced in an alias token $value
 *
 * @example
 * const alias = { $value: '{colors.blue.500}'}
 * ctx.getRawPathFromAlias(alias) // ['colors', '$tokens', 'blue', '$tokens', '500]
 */
// export function getRawPathFromAlias(aliasToken: DesignTokenAlias) {
//   if (!isAliasToken(aliasToken)) {
//     throw new Error(
//       '`getRawPathFromAlias` can only be called on an alias token.',
//     )
//   }

//   return aliasToken.$value
//     .trim()
//     .slice(1, -1)
//     .replace(/\./g, '.$tokens.')
//     .split('.')
// }

/**
 * Retrieves the token referenced in the alias token $value from the design tokens object.
 *
 * @example
 * const alias = { $value: '{colors.blue.500}'}
 * ctx.getTokenFromAlias(alias, designTokens) // #0000ff
 */
// export function getTokenFromAlias(
//   aliasToken: DesignTokenAlias,
//   tokens: DesignTokens,
// ) {
//   if (!isAliasToken(aliasToken)) {
//     throw new Error('`getTokenFromAlias` can only be called on an alias token.')
//   }

//   const rawPath = getRawPathFromAlias(aliasToken)

//   let token: any = tokens

//   // TODO: https://github.com/angus-c/just/tree/master/packages/object-safe-get
//   for (const path of rawPath) {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
//     token = token[path]
//   }

//   return token as AllDesignTokens
// }

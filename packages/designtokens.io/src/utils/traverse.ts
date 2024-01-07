import type {
  AllDesignTokens,
  DesignTokens,
  DesignToken,
  DesignTokenAlias,
  DesignTokenComposite,
  DesignTokenGroup,
} from '../types'

type WalkContext = {
  path: string[]
}

type WalkCallback = (node: AllDesignTokens, context: WalkContext) => void

function walk(tokens: DesignTokens, cb: WalkCallback) {
  function walkInner(
    tokensInner: DesignTokens | AllDesignTokens,
    cbInner: WalkCallback,
    _path: string[] = [],
  ) {
    for (const entry of Object.entries(tokensInner)) {
      const [key, node] = entry as [string, AllDesignTokens]

      if (typeof node === 'object' && node !== null) {
        const path = [..._path, key]
        cbInner(node, { path })
        walkInner(node, cb, path)
      }
    }
  }

  walkInner(tokens, cb)
}

export interface TraverseOptions {
  onToken?: (token: DesignToken, context: TraverseContext) => void
  onAlias?: (alias: DesignTokenAlias, context: TraverseContext) => void
  onComposite?: (
    composite: DesignTokenComposite,
    context: TraverseContext,
  ) => void
  onGroup?: (group: DesignTokenGroup, context: TraverseContext) => void
}

export function traverse(tokens: DesignTokens, options: TraverseOptions): void {
  walk(tokens, (node, context) => {
    if (isDesignToken(node)) {
      // Design token
      options?.onToken?.(node, createContext({ tokens, context }))
    } else if (isAliasToken(node)) {
      // Alias token
      options?.onAlias?.(node, createContext({ tokens, context }))
    } else if (isCompositeToken(node)) {
      // Composite token
      options?.onComposite?.(node, createContext({ tokens, context }))
    } else if (isTokenGroup(node)) {
      // Token group
      options?.onGroup?.(node, createContext({ tokens, context }))
    }
  })
}

export function isDesignTokenValue(
  value: unknown,
): value is DesignToken['$value'] {
  if (typeof value === 'number') return true

  if (typeof value === 'string' && !value.startsWith('{')) {
    return true
  }

  return false
}

export function isDesignToken(
  tokenOrGroup: unknown,
): tokenOrGroup is DesignToken {
  if (!Object.hasOwnProperty.call(tokenOrGroup, '$value')) return false

  return isDesignTokenValue((tokenOrGroup as DesignToken).$value)
}

export function isAliasTokenValue(
  value: unknown,
): value is DesignTokenAlias['$value'] {
  if (typeof value === 'string' && value.startsWith('{')) {
    return true
  }

  return false
}

export function isAliasToken(
  tokenOrGroup: AllDesignTokens,
): tokenOrGroup is DesignTokenAlias {
  if (!Object.hasOwnProperty.call(tokenOrGroup, '$value')) return false

  return isAliasTokenValue((tokenOrGroup as DesignTokenAlias).$value)
}

export function isCompositeToken(
  tokenOrGroup: AllDesignTokens,
): tokenOrGroup is DesignTokenComposite {
  if (!Object.hasOwnProperty.call(tokenOrGroup, '$value')) return false

  const tokenOrComposite = tokenOrGroup as DesignToken | DesignTokenComposite

  if (
    typeof tokenOrComposite.$value === 'object' &&
    tokenOrComposite.$value !== null
  ) {
    return true
  }

  return false
}

export function isTokenGroup(
  tokenOrGroup: AllDesignTokens,
): tokenOrGroup is DesignTokenGroup {
  return Boolean((tokenOrGroup as DesignTokenGroup)?.$tokens)
}

export interface TraverseContext {
  /**
   * Name of the current token, alias, or group.
   *
   * Note: This is a convenience property that is equivalent to `path[path.length - 1]`.
   */
  name: string
  /**
   * Reference to the root design tokens object.
   */
  tokens: DesignTokens
  /**
   * An array of token names leading to the current token.
   *
   * Note: This path has been filtered to exclude the `$tokens` property.
   * Helpful for composing token names such as CSS custom properties.
   */
  path: string[]
  /**
   * Raw path of the current token, alias, or group.
   *
   * Note: This path has not been filtered and contains the full path to
   * the current token from the root of the design tokens object.
   * Helpful for resolving an alias token's `$value` property.
   */
  rawPath: string[]
  /**
   * Retrieves the path to the token referenced in the alias token $value.
   *
   * Note: This path has been filtered to exclude the `$tokens` property.
   * Helpful for composing token names such as CSS custom properties.
   */
  getPathFromAlias: (aliasToken: DesignTokenAlias) => string[]
  /**
   * Retrieves the raw path to the token referenced in an alias token $value
   *
   * Note: This path has not been filtered and contains the full path to
   * the current token from the root of the design tokens object.
   * Helpful for resolving an alias token's `$value` property.
   */
  getRawPathFromAlias: (aliasToken: DesignTokenAlias) => string[]
  /**
   * Retrieves the token referenced in the alias token $value from the design tokens object.
   */
  getTokenFromAlias: (
    aliasToken: DesignTokenAlias,
    tokens: DesignTokens,
  ) => AllDesignTokens
  isDesignToken: typeof isDesignToken
  isDesignTokenValue: typeof isDesignTokenValue
  isAliasToken: typeof isAliasToken
  isAliasTokenValue: typeof isAliasTokenValue
  isCompositeToken: typeof isCompositeToken
  isTokenGroup: typeof isTokenGroup
}

interface CreateContextOptions {
  tokens: DesignTokens
  context: WalkContext
}

function createContext(options: CreateContextOptions): TraverseContext {
  return {
    name: options.context.path[options.context.path.length - 1]!,
    tokens: options.tokens,
    path: options.context.path.filter((p) => p !== '$tokens'),
    rawPath: options.context.path,
    getPathFromAlias,
    getRawPathFromAlias,
    getTokenFromAlias,
    isDesignToken,
    isDesignTokenValue,
    isAliasToken,
    isAliasTokenValue,
    isCompositeToken,
    isTokenGroup,
  }
}

/**
 * Retrieves the path to the token referenced in an alias token $value.
 *
 * @example
 * const alias = { $value: '{colors.blue.500}'}
 * ctx.getPathFromAlias(alias) // ['colors', 'blue', '500]
 */
export function getPathFromAlias(aliasToken: DesignTokenAlias) {
  if (!isAliasToken(aliasToken)) {
    throw new Error('`getPathFromAlias` can only be called on an alias token.')
  }

  return aliasToken.$value.trim().slice(1, -1).split('.')
}

/**
 * Retrieves the raw path to the token referenced in an alias token $value
 *
 * @example
 * const alias = { $value: '{colors.blue.500}'}
 * ctx.getRawPathFromAlias(alias) // ['colors', '$tokens', 'blue', '$tokens', '500]
 */
export function getRawPathFromAlias(aliasToken: DesignTokenAlias) {
  if (!isAliasToken(aliasToken)) {
    throw new Error(
      '`getRawPathFromAlias` can only be called on an alias token.',
    )
  }

  return aliasToken.$value
    .trim()
    .slice(1, -1)
    .replace(/\./g, '.$tokens.')
    .split('.')
}

/**
 * Retrieves the token referenced in the alias token $value from the design tokens object.
 *
 * @example
 * const alias = { $value: '{colors.blue.500}'}
 * ctx.getTokenFromAlias(alias, designTokens) // #0000ff
 */
export function getTokenFromAlias(
  aliasToken: DesignTokenAlias,
  tokens: DesignTokens,
) {
  if (!isAliasToken(aliasToken)) {
    throw new Error('`getTokenFromAlias` can only be called on an alias token.')
  }

  const rawPath = getRawPathFromAlias(aliasToken)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let token: any = tokens

  // TODO: https://github.com/angus-c/just/tree/master/packages/object-safe-get
  for (const path of rawPath) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    token = token[path]
  }

  return token as AllDesignTokens
}

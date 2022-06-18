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

export function isDesignToken(
  tokenOrGroup: AllDesignTokens,
): tokenOrGroup is DesignToken {
  if (!Object.hasOwnProperty.call(tokenOrGroup, '$value')) return false

  const tokenOrAlias = tokenOrGroup as DesignToken | DesignTokenAlias

  if (typeof tokenOrAlias.$value === 'number') return true

  if (
    typeof tokenOrAlias.$value === 'string' &&
    !tokenOrAlias.$value.startsWith('{')
  ) {
    return true
  }

  return false
}

export function isAliasToken(
  tokenOrGroup: AllDesignTokens,
): tokenOrGroup is DesignTokenAlias {
  if (!Object.hasOwnProperty.call(tokenOrGroup, '$value')) return false

  const tokenOrAlias = tokenOrGroup as DesignToken | DesignTokenAlias

  if (
    typeof tokenOrAlias.$value === 'string' &&
    tokenOrAlias.$value.startsWith('{')
  ) {
    return true
  }

  return false
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
   * Path of the current token, alias, or group.
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
   * Helpful for resolving an alias tokens $value.
   */
  rawPath: string[]
  /**
   * Path of the current alias token's $value.
   *
   * Note: This path has been filtered to exclude the `$tokens` property.
   * Helpful for composing token names such as CSS custom properties.
   */
  getAliasPath: (aliasToken: DesignTokenAlias) => string[]
  /**
   * Raw path of the current alias token's $value.
   *
   * Note: This path has not been filtered and contains the full path to
   * the current token from the root of the design tokens object.
   * Helpful for resolving an alias token $value.
   */
  getAliasRawPath: (aliasToken: DesignTokenAlias) => string[]
  /**
   * Resolved $value of the current alias token.
   */
  getAliasValue: (
    aliasToken: DesignTokenAlias,
    tokens: DesignTokens,
  ) => string | number
}

interface CreateContextOptions {
  tokens: DesignTokens
  context: WalkContext
}

function createContext(options: CreateContextOptions): TraverseContext {
  return {
    name: options.context.path[options.context.path.length - 1]!,
    path: options.context.path.filter((p) => p !== '$tokens'),
    rawPath: options.context.path,
    getAliasPath,
    getAliasRawPath,
    getAliasValue,
  }
}

/**
 * Parse an alias token $value into an array of design token path segments.
 *
 * @example
 * const alias = { $value: '{colors.blue.500}'}
 * ctx.getAliasPath(alias) // ['colors', 'blue', '500]
 */
export function getAliasPath(aliasToken: DesignTokenAlias) {
  if (!isAliasToken(aliasToken)) {
    throw new Error('`getAliasPath` can only be called on an alias token.')
  }

  return aliasToken.$value.trim().slice(1, -1).split('.')
}

/**
 * Parse an alias token $value into an array of the full design token path segments.
 *
 * @example
 * const alias = { $value: '{colors.blue.500}'}
 * ctx.getAliasRawPath(alias) // ['colors', '$tokens', 'blue', '$tokens', '500]
 */
export function getAliasRawPath(aliasToken: DesignTokenAlias) {
  if (!isAliasToken(aliasToken)) {
    throw new Error('`getAliasRawPath` can only be called on an alias token.')
  }

  return aliasToken.$value
    .trim()
    .slice(1, -1)
    .replace(/\./g, '.$tokens.')
    .split('.')
}

/**
 * Retrieves the alias token $value from the design tokens object.
 *
 * @example
 * const alias = { $value: '{colors.blue.500}'}
 * ctx.getAliasValue(alias, designTokens) // #0000ff
 */
export function getAliasValue(
  aliasToken: DesignTokenAlias,
  tokens: DesignTokens,
) {
  if (!isAliasToken(aliasToken)) {
    throw new Error('`getAliasValue` can only be called on an alias token.')
  }

  const rawPath = getAliasRawPath(aliasToken)

  let $value: any = tokens

  // TODO: https://github.com/angus-c/just/tree/master/packages/object-safe-get
  for (const key of rawPath) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    $value = $value[key]
  }

  return $value as DesignToken['$value']
}

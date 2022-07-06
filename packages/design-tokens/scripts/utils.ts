import * as dt from 'designtokens.io'

import { designTokens } from '../src'

interface CreateCSSClassOptions {
  delimiter?: string
  prefix?: string
}

export function createCSSClass(
  className: string,
  options: CreateCSSClassOptions = {},
) {
  const { prefix, delimiter = '-' } = options

  return `.${prefix ? `${prefix}${delimiter}` : ''}${className}`
}

export function createCSSDeclaration(prop: string, value: string | number) {
  return `${prop}: ${value};`
}

/**
 * @example
 * onComposite(composite, ctx) {
 *   if (ctx.isDesignTokenValue($value)) {
 *     declarations.push(createCSSDeclaration(cssProp, $value))
 *   }
 *   else if (ctx.isAliasTokenValue($value)) {
 *     const alias = dt.createDesignTokenAlias({ $value })
 *     const value = getValueFromAlias(alias, ctx.tokens)
 *
 *     declarations.push(createCSSDeclaration(cssProp, value))
 *   }
 * }
 */
export function getValueFromAlias(
  aliasToken: dt.DesignTokenAlias,
  tokens: dt.DesignTokens,
) {
  if (!dt.isAliasToken(aliasToken)) {
    throw new Error('`getValueFromAlias` can only be called on an alias token.')
  }

  const token = dt.getTokenFromAlias(aliasToken, tokens)

  if (!dt.isDesignToken(token)) {
    throw new Error('Invalid alias. Must refer to a design token.')
  }

  return token.$value
}

export function toKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export const rootFontSizeRule = `html {
  font-size: ${designTokens.typography.$tokens.fontSize.$tokens.base.$value};
}`

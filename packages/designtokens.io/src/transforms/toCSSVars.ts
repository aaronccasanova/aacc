import redent from 'redent'

import type { DesignTokens } from '../types'

import { traverse } from '../utils/traverse'
import { cssVarCreator, CreatorOptions } from './utils'

export interface ToCSSVarsOptions extends CreatorOptions {
  selector?: string | null
}

/**
 * Transforms design tokens into CSS variables.
 *
 * @param tokens - Design tokens to transform.
 * @param options - Options for the transformation.
 * @property [options.selector] - Selector wrapping the CSS variables. Set to `null` to disable.
 * @property [options.prefix] - Prefix added to the CSS variable name.
 * @property [options.delimiter] - Delimiter used between segments of the CSS variable name.
 * @returns A string of CSS variables.
 */
export const toCSSVars = (
  tokens: DesignTokens,
  options: ToCSSVarsOptions = {},
) => {
  const createCSSVar = cssVarCreator(options)
  const selector = options.selector ?? ':root'

  const cssVars: string[] = []

  traverse(tokens, {
    onToken: (token, ctx) => {
      cssVars.push(`${createCSSVar(ctx.path)}: ${token.$value};`)
    },
    onAlias: (alias, ctx) => {
      const cssVar = createCSSVar(ctx.getAliasPath(alias))

      cssVars.push(`${createCSSVar(ctx.path)}: var(${cssVar});`)
    },
  })

  return options.selector === null
    ? redent(cssVars.join('\n'), 0)
    : [`${selector} {`, redent(cssVars.join('\n'), 2), '}'].join('\n')
}

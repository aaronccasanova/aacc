import type { DesignTokens } from '../types'

import { traverse } from '../utils/traverse'
import { scssVarCreator, CreatorOptions } from './utils'

export type ToSCSSVarsOptions = CreatorOptions

/**
 * Transforms design tokens into SCSS variables.
 *
 * @param tokens - Design tokens to transform.
 * @param options - Options for the transformation.
 * @property [options.prefix] - Prefix added to the SCSS variable name.
 * @property [options.delimiter] - Delimiter used between segments of the SCSS variable name.
 * @returns A string of SCSS variables.
 */
export const toSCSSVars = (
  tokens: DesignTokens,
  options: ToSCSSVarsOptions = {},
) => {
  const createSCSSVar = scssVarCreator(options)
  const scssVars: string[] = []

  traverse(tokens, {
    onToken: (token, ctx) => {
      scssVars.push(`${createSCSSVar(ctx.path)}: ${token.$value};`)
    },
    onAlias: (alias, ctx) => {
      const scssVar = createSCSSVar(ctx.getAliasPath(alias))
      scssVars.push(`${createSCSSVar(ctx.path)}: ${scssVar};`)
    },
  })

  return scssVars.join('\n')
}

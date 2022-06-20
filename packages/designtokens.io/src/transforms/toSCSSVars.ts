import type { DesignTokens } from '../types'

import { traverse, createDesignTokenAlias } from '../utils'
import { scssVarCreator, CreatorOptions } from './utils'

export type ToSCSSVarsOptions = CreatorOptions

/**
 * Transforms design tokens into SCSS variables.
 *
 * @param tokens - The design tokens to transform.
 * @param options - The transformation options.
 * @property [options.prefix] - The prefix added to each SCSS variable name.
 * @property [options.delimiter] - The delimiter used when joining a design token path to create SCSS variable names. Defaults to `-`.
 * @returns A string of SCSS variables.
 */
export const toSCSSVars = (
  tokens: DesignTokens,
  options: ToSCSSVarsOptions = {},
) => {
  const createSCSSVar = scssVarCreator(options)
  const scssVars: string[] = []

  function createDeclaration(path: string[], value: string | number) {
    return `${createSCSSVar(path)}: ${value};`
  }

  traverse(tokens, {
    onToken: (token, ctx) => {
      scssVars.push(createDeclaration(ctx.path, token.$value))
    },
    onAlias: (alias, ctx) => {
      const scssVar = createSCSSVar(ctx.getPathFromAlias(alias))

      scssVars.push(createDeclaration(ctx.path, scssVar))
    },
    onComposite: (composite, ctx) => {
      for (const [name, $value] of Object.entries(composite.$value)) {
        const valuePath = [...ctx.path, name]

        if (ctx.isDesignTokenValue($value)) {
          scssVars.push(createDeclaration(valuePath, $value))
        }
        //
        else if (ctx.isAliasTokenValue($value)) {
          const scssVar = createSCSSVar(
            ctx.getPathFromAlias(createDesignTokenAlias({ $value })),
          )

          scssVars.push(createDeclaration(valuePath, scssVar))
        }
      }
    },
  })

  return scssVars.join('\n')
}

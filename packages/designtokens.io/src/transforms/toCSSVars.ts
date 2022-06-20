import type { DesignTokens } from '../types'

import { traverse, createDesignTokenAlias } from '../utils'
import { cssVarCreator, CreatorOptions } from './utils'

export interface ToCSSVarsOptions extends CreatorOptions {
  selector?: string | null
  indent?: string
}

/**
 * Transforms design tokens into CSS variables.
 *
 * @param tokens - The design tokens to transform.
 * @param options - The transformation options.
 * @property [options.selector] - The selector wrapping the CSS variables. Set to `null` to disable.
 * @property [options.prefix] - The prefix added to each CSS variable name.
 * @property [options.delimiter] - The delimiter used when joining a design token path to create CSS variable names. Defaults to `-`.
 * @property [options.indent] - The indentation used for each CSS variable when wrapped in a `selector`.
 * @returns A string of CSS variables.
 */
export const toCSSVars = (
  tokens: DesignTokens,
  options: ToCSSVarsOptions = {},
) => {
  const createCSSVar = cssVarCreator(options)
  const selector = options.selector ?? ':root'
  const indent = options.indent ?? ' '.repeat(2)

  const cssVars: string[] = []

  function createDeclaration(
    path: string[],
    value: string | number,
    alias = false,
  ) {
    return `${createCSSVar(path)}: ${alias ? `var(${value})` : value};`
  }

  traverse(tokens, {
    onToken: (token, ctx) => {
      cssVars.push(createDeclaration(ctx.path, token.$value))
    },
    onAlias: (alias, ctx) => {
      const cssVar = createCSSVar(ctx.getPathFromAlias(alias))

      cssVars.push(createDeclaration(ctx.path, cssVar, true))
    },
    onComposite: (composite, ctx) => {
      for (const [name, $value] of Object.entries(composite.$value)) {
        const valuePath = [...ctx.path, name]

        if (ctx.isDesignTokenValue($value)) {
          cssVars.push(createDeclaration(valuePath, $value))
        }
        //
        else if (ctx.isAliasTokenValue($value)) {
          const cssVar = createCSSVar(
            ctx.getPathFromAlias(createDesignTokenAlias({ $value })),
          )

          cssVars.push(createDeclaration(valuePath, cssVar, true))
        }
      }
    },
  })

  return options.selector === null
    ? cssVars.join('\n')
    : [`${selector} {`, cssVars.map((cssVar) => `${indent}${cssVar}`), '}']
        .flat()
        .join('\n')
}

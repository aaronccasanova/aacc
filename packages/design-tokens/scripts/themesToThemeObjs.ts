import * as fs from 'node:fs'
import * as path from 'node:path'

import type * as tf from 'type-fest'
import set from 'just-safe-set'
import {
  traverse,
  createDesignTokenAlias,
  TraverseContext,
  DesignTokenAlias,
} from 'designtokens.io'

import type { DesignTokens, Themes } from '../src'

const outputDir = path.join(__dirname, '../dist/theme')

export async function themesToThemeObjs(themes: Themes) {
  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir, { recursive: true })
  }

  await Promise.all(
    Object.entries(themes).map(async (entry) => {
      const [themeKey, designTokens] = entry as tf.Entry<Themes>

      const theme = toTheme(designTokens)

      await fs.promises.writeFile(
        path.join(outputDir, `${themeKey}.ts`),
        `export const ${themeKey} = ${JSON.stringify(theme, null, 2)} as const`,
      )
    }),
  )
}

function toTheme(designTokens: DesignTokens) {
  const theme = {}

  function setThemeProp(propPath: string[], value: string | number) {
    set(theme, propPath, value)
  }

  function setThemePropFromAlias(
    ctx: TraverseContext,
    propPath: string[],
    alias: DesignTokenAlias,
  ) {
    const token = ctx.getTokenFromAlias(alias, ctx.tokens)

    if (ctx.isDesignToken(token)) {
      setThemeProp(propPath, token.$value)
    } else {
      throw new Error('Invalid alias. Must refer to a design token.')
    }
  }

  traverse(designTokens, {
    onToken: (token, ctx) => {
      setThemeProp(ctx.path, token.$value)
    },
    onAlias: (alias, ctx) => {
      setThemePropFromAlias(ctx, ctx.path, alias)
    },
    onComposite: (composite, ctx) => {
      for (const [name, $value] of Object.entries(composite.$value)) {
        const valuePath = [...ctx.path, name]

        if (ctx.isDesignTokenValue($value)) {
          setThemeProp(valuePath, $value)
        }
        //
        else if (ctx.isAliasTokenValue($value)) {
          const alias = createDesignTokenAlias({ $value })

          setThemePropFromAlias(ctx, valuePath, alias)
        }
      }
    },
  })

  return theme
}

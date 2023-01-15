import * as fs from 'node:fs'
import * as path from 'node:path'

import type * as tf from 'type-fest'

// eslint-disable-next-line import/no-extraneous-dependencies
import * as ts from 'typescript'
// @ts-ignore
import set from 'just-safe-set'
import * as dt from 'designtokens.io'

import type { DesignTokens, Themes } from '../src'

const outputDir = path.join(__dirname, '../dist/themes')
const tsPaths: string[] = []

const convertedCompilerOptions = getConvertedCompilerOptions(
  path.join(__dirname, '../tsconfig.json'),
)

export async function themesToThemeObjs(themes: Themes) {
  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir, { recursive: true })
  }

  await Promise.all(
    Object.entries(themes).map(async (entry) => {
      const [themeKey, designTokens] = entry as tf.Entry<Themes>

      const theme = toTheme(designTokens)
      const rawSource = `${themeKey} = ${JSON.stringify(theme, null, 2)}`

      const cjsThemePath = path.join(outputDir, `${themeKey}.js`)
      const esmThemePath = path.join(outputDir, `${themeKey}.mjs`)
      const tsThemePath = path.join(outputDir, `${themeKey}.ts`)

      tsPaths.push(tsThemePath)

      await Promise.all([
        fs.promises.writeFile(cjsThemePath, `exports.${rawSource}`),
        fs.promises.writeFile(esmThemePath, `export const ${rawSource}`),
        fs.promises.writeFile(
          tsThemePath,
          `export const ${rawSource} as const`,
        ),
      ])
    }),
  )

  const cjsIndexPath = path.join(outputDir, 'index.js')
  const esmIndexPath = path.join(outputDir, 'index.mjs')
  const tsIndexPath = path.join(outputDir, 'index.ts')

  await Promise.all([
    await fs.promises.writeFile(
      cjsIndexPath,
      tsPaths
        .map((themePath) => {
          const themeKey = path.parse(themePath).name

          return `exports.${themeKey} = require('./${themeKey}')`
        })
        .join('\n'),
    ),
    await fs.promises.writeFile(
      esmIndexPath,
      tsPaths
        .map((themePath) => `export * from './${path.parse(themePath).name}'`)
        .join('\n'),
    ),
    await fs.promises.writeFile(
      tsIndexPath,
      tsPaths
        .map((themePath) => `export * from './${path.parse(themePath).name}'`)
        .join('\n'),
    ),
  ])

  compile([tsIndexPath], {
    ...convertedCompilerOptions,
    declarationDir: outputDir,
    emitDeclarationOnly: true,
  })

  // Remove all tsPaths (only used to emit declarations)
  await Promise.all(
    [tsIndexPath, ...tsPaths].map(async (tsPath) => {
      await fs.promises.rm(tsPath)
    }),
  )
}

function toTheme(designTokens: DesignTokens) {
  const theme = {}

  function setThemeProp(propPath: string[], value: string | number) {
    set(theme, propPath, value)
  }

  function setThemePropFromAlias(
    ctx: dt.TraverseContext,
    propPath: string[],
    alias: dt.DesignTokenAlias,
  ) {
    const token = ctx.getTokenFromAlias(alias, ctx.tokens)

    if (ctx.isDesignToken(token)) {
      setThemeProp(propPath, token.$value)
    } else {
      throw new Error('Invalid alias. Must refer to a design token.')
    }
  }

  dt.traverse(designTokens, {
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
          const alias = dt.createDesignTokenAlias({ $value })

          setThemePropFromAlias(ctx, valuePath, alias)
        }
      }
    },
  })

  return theme
}

/**
 * Minimal compiler:
 * https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#a-minimal-compiler
 */
function compile(fileNames: string[], options: ts.CompilerOptions): void {
  const program = ts.createProgram(fileNames, options)
  const emitResult = program.emit()

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics)

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      const { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start!,
      )

      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n',
      )

      console.log(
        `${diagnostic.file.fileName} (${line + 1},${
          character + 1
        }): ${message}`,
      )
    } else {
      console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
    }
  })

  const exitCode = emitResult.emitSkipped ? 1 : 0

  if (exitCode !== 0) {
    process.exit(exitCode)
  }
}

function getConvertedCompilerOptions(filePath: string) {
  const compilerOptions = ts.convertCompilerOptionsFromJson(
    getCompilerOptionsJSONFollowExtends(filePath),
    '',
  )

  if (compilerOptions.errors.length > 0) {
    throw new Error(
      `Failed to get converted compiler options: ${JSON.stringify(
        compilerOptions.errors,
        null,
        2,
      )}`,
    )
  }

  return compilerOptions.options
}

/**
 * How to compile tsconfig.json into a config object using TypeScript API?
 * https://stackoverflow.com/a/68008175
 */
function getCompilerOptionsJSONFollowExtends(filePath: string) {
  let compilerOptions = {}

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const config = ts.readConfigFile(filePath, ts.sys.readFile)
    .config as tf.TsConfigJson

  if (config.extends) {
    const extendedConfigPath = require.resolve(
      config.extends.startsWith('./') || config.extends.startsWith('../')
        ? path.join(path.dirname(filePath), config.extends)
        : config.extends,
    )

    compilerOptions = getCompilerOptionsJSONFollowExtends(extendedConfigPath)
  }

  return {
    ...compilerOptions,
    ...config.compilerOptions,
  }
}

import * as path from 'node:path'
import * as url from 'node:url'

// @ts-ignore
import safeSet from 'just-safe-set'
import globby from 'globby'

function getCWD(options: GlobModulesCWDOptions) {
  if ('cwd' in options) {
    return path.resolve(options.cwd)
  }

  if ('importMeta' in options) {
    return path.dirname(url.fileURLToPath(options.importMeta.url))
  }

  throw new Error('globModules: cwd or importMeta must be specified')
}

type GlobbyParameters = Parameters<typeof globby>

type GlobModulesCWDOptions =
  | {
      cwd: string
    }
  | {
      importMeta: ImportMeta
    }

export type GlobModulesPatterns = GlobbyParameters[0]
export type GlobModulesOptions = GlobModulesCWDOptions

// TODO: Add import-lazy
// - lib: https://www.npmjs.com/package/import-lazy
// - reference: https://github.com/stylelint/stylelint/blob/main/lib/rules/index.js
type GlobModulesResult = { [globModuleNames: string]: any }

export async function globModules<T extends GlobModulesResult>(
  patterns: GlobModulesPatterns,
  options: GlobModulesOptions,
): Promise<T> {
  const cwd = getCWD(options)

  const modules: GlobModulesResult = {}

  const modulePaths = await globby(patterns, { cwd })

  for (const modulePath of modulePaths) {
    const moduleSpecifier = path.join(cwd, modulePath)

    const moduleName = path.parse(moduleSpecifier).name

    const moduleSegments = moduleSpecifier
      .replace(`${cwd}${path.sep}`, '')
      .split(path.sep)
      .filter(Boolean)

    // NOTE: This POC assumes only one extension type was
    //       used in the glob pattern.
    moduleSegments[moduleSegments.length - 1] = moduleName

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-await-in-loop
    const mod: { [modName: string]: any } = await import(moduleSpecifier)

    for (const modName of Object.keys(mod)) {
      safeSet(modules, [...moduleSegments, modName], mod[modName])
    }
  }

  return modules as T
}

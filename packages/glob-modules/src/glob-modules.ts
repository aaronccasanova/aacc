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

  throw new Error('`options.cwd` or `options.importMeta` must be specified')
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
export type GlobModulesOptions<T extends GlobModulesResult> =
  GlobModulesCWDOptions & {
    schema?: { parse: (globbedModules: unknown) => T }
  }

// TODO: Add import-lazy
// - lib: https://www.npmjs.com/package/import-lazy
// - reference: https://github.com/stylelint/stylelint/blob/main/lib/rules/index.js
type GlobModulesResult = { [globModuleNames: string]: any }

export async function globModules<T extends GlobModulesResult>(
  patterns: GlobModulesPatterns,
  options: GlobModulesOptions<T>,
): Promise<T> {
  const cwd = getCWD(options)

  const modules: GlobModulesResult = {}

  const modulePaths = await globby(patterns, {
    absolute: true,
    cwd,
  })

  if (!modulePaths.length) {
    throw new Error(`Cannot find modules for patterns: ${patterns.toString()}`)
  }

  const commonParentModuleDir = getCommonParentModuleDir(cwd, modulePaths)

  for (const modulePath of modulePaths) {
    // TODO: Investigate a Promise.all() implementation.
    // eslint-disable-next-line no-await-in-loop
    const mod = (await import(modulePath)) as { [modName: string]: any }

    const moduleSegments = modulePath
      .slice(1)
      .replace(`${commonParentModuleDir}${path.sep}`, '')
      .split(path.sep)

    // NOTE: This POC assumes only one extension type was used in the glob pattern.
    moduleSegments[moduleSegments.length - 1] = path.parse(modulePath).name

    for (const modName of Object.keys(mod)) {
      safeSet(modules, moduleSegments.concat(modName), mod[modName])
    }
  }

  if (options.schema) {
    return options.schema.parse(modules)
  }

  return modules as T
}

function getCommonParentModuleDir(cwd: string, modulePaths: string[]) {
  // NOTE: All paths are assumed to be absolute.
  const commonParentModuleSegments = cwd.slice(1).split(path.sep)

  for (const modulePath of modulePaths) {
    const moduleSegments = modulePath.slice(1).split(path.sep)

    for (const [i, moduleSegment] of moduleSegments.entries()) {
      if (moduleSegment !== commonParentModuleSegments[i]) {
        commonParentModuleSegments.splice(i, Infinity) // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice#deletecount

        break
      }
    }
  }

  return commonParentModuleSegments.join(path.sep)
}

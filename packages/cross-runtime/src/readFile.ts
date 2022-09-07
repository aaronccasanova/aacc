import type {
  NodeReadFile,
  DenoReadFile,
  DenoReadTextFile,
} from './dynamic-import-apis/index.js'

import { getRuntime, Runtime, UnsupportedRuntimeAPIError } from './utils.js'

type ReadFilePath = string | URL

type ReadFileEncoding = 'utf8' | 'uint8'

type ReadFileOptions = {
  /**
   * Character encoding of the read file.
   * @default 'utf8'
   */
  encoding?: ReadFileEncoding
}

const defaultEncoding: ReadFileEncoding = 'utf8'

const getEncodingOption = (options?: ReadFileOptions) =>
  options?.encoding ?? defaultEncoding

type RuntimeModuleMap = {
  deno: DenoReadFile | DenoReadTextFile
  node: NodeReadFile
  bun: NodeReadFile
}

type SupportedReadFileRuntime = Extract<Runtime, keyof RuntimeModuleMap>

interface RuntimeConfig<T extends SupportedReadFileRuntime> {
  onLoad: (options?: ReadFileOptions) => Promise<RuntimeModuleMap[T]>
  onCall: (
    runtimeModule: RuntimeModuleMap[T],
    path: ReadFilePath,
    options?: ReadFileOptions,
  ) => Promise<string | Uint8Array>
}

type RuntimeConfigs = {
  [R in SupportedReadFileRuntime]: RuntimeConfig<R>
}

export const runtimeConfigs: RuntimeConfigs = {
  node: {
    onLoad: async () => {
      const mod = await import('./dynamic-import-apis/node/readFile.js')

      return mod.readFile
    },
    onCall: async (nodeReadFile, path, options) => {
      const encoding = getEncodingOption(options)

      if (encoding === 'uint8') {
        return nodeReadFile(path)
      }

      return nodeReadFile(path, { encoding: 'utf8' })
    },
  },
  bun: {
    onLoad: async () => {
      const mod = await import('./dynamic-import-apis/node/readFile.js')

      return mod.readFile
    },
    onCall: async (nodeReadFile, path, options) => {
      const encoding = getEncodingOption(options)

      if (encoding === 'uint8') {
        return nodeReadFile(path)
      }

      return nodeReadFile(path, { encoding: 'utf8' })
    },
  },
  deno: {
    onLoad: async (options) => {
      const encoding = getEncodingOption(options)

      if (encoding === 'uint8') {
        const mod = await import('./dynamic-import-apis/deno/readFile.js')

        return mod.readFile
      }

      const mod = await import('./dynamic-import-apis/deno/readTextFile.js')

      return mod.readTextFile
    },
    onCall: async (runtimeModule, path, options) => {
      const encoding = getEncodingOption(options)

      if (encoding === 'uint8') {
        // TODO: Enforce better with type guards
        const denoReadFile = runtimeModule as DenoReadFile

        return denoReadFile(path)
      }

      const denoReadTextFile = runtimeModule as DenoReadTextFile

      return denoReadTextFile(path)
    },
  },
}

const runtime = getRuntime()

const runtimeConfig =
  runtime !== null && Object.keys(runtimeConfigs).includes(runtime)
    ? runtimeConfigs[runtime as SupportedReadFileRuntime]
    : null

type ReadFileReturnType<T> = T extends undefined
  ? string
  : T extends { encoding: 'uint8' }
  ? Uint8Array
  : string

export const readFile = async <T extends ReadFileOptions>(
  path: ReadFilePath,
  options?: T,
): Promise<ReadFileReturnType<T>> => {
  if (!runtimeConfig) {
    throw new UnsupportedRuntimeAPIError('readFiles')
  }

  const runtimeReadFile = await runtimeConfig.onLoad(options)

  return runtimeConfig.onCall(
    // Ignoring as strict validation is applied to the `RuntimeConfigs` type
    // ensuring `runtimeReadFile` corresponds to the current runtime module
    // @ts-ignore
    runtimeReadFile,
    path,
    options,
  ) as Promise<ReadFileReturnType<T>>
}

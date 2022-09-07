import type {
  NodeWriteFile,
  DenoWriteFile,
  DenoWriteTextFile,
  BunWrite,
} from './dynamic-import-apis/index.js'

import { getRuntime, Runtime, UnsupportedRuntimeAPIError } from './utils.js'

type WriteFilePath = string | URL

type WriteFileEncoding = 'utf8'

type WriteFileOptions = {
  /**
   * Character encoding written to the file.
   * @default 'utf8'
   */
  encoding?: WriteFileEncoding
  /**
   * If true, append to a file instead of overwriting contents.
   * @default false
   */
  append?: boolean
  /**
   * If true, create a file if one doesn't exist.
   * @default true
   */
  create?: boolean
}

const defaultEncoding: WriteFileEncoding = 'utf8'
const defaultAppend = false
const defaultCreate = true

const isDataTypedArray = (data: unknown): data is Uint8Array =>
  data instanceof Uint8Array

type RuntimeModuleMap = {
  deno: DenoWriteFile | DenoWriteTextFile
  node: NodeWriteFile
  bun: BunWrite
}

type SupportedWriteFileRuntime = Extract<Runtime, keyof RuntimeModuleMap>

interface RuntimeConfig<T extends SupportedWriteFileRuntime> {
  onLoad: (options: { withTypedArray: boolean }) => Promise<RuntimeModuleMap[T]>
  onCall: (
    runtimeModule: RuntimeModuleMap[T],
    path: WriteFilePath,
    data: string | Uint8Array,
    options?: WriteFileOptions,
  ) => Promise<void>
}

type RuntimeConfigs = {
  [R in SupportedWriteFileRuntime]: RuntimeConfig<R>
}

export const runtimeConfigs: RuntimeConfigs = {
  node: {
    onLoad: async () => {
      const { writeFile } = await import(
        './dynamic-import-apis/node/writeFile.js'
      )

      return writeFile
    },
    onCall: (nodeWriteFile, path, data, options) =>
      nodeWriteFile(path, data, {
        encoding: defaultEncoding,
        // https://nodejs.org/api/fs.html#file-system-flags
        flag:
          (options?.append ?? defaultAppend ? 'a' : 'w') +
          (options?.create ?? defaultCreate ? '' : 'x'),
      }),
  },
  bun: {
    onLoad: async () => {
      const { write } = await import('./dynamic-import-apis/bun/write.js')

      return write
    },
    onCall: async (bunWrite, path, data, options) => {
      // TODO: Polyfill Bun API / Or use the Node.js API
      // - options.append - If true, read file and manually append to it
      // - options.create - If false, check if file exists and manually throw error
      if (options?.append) throw new Error('Bun does not support [append] mode')
      if (options?.create) throw new Error('Bun does not support [create] mode')

      await bunWrite(path, data)
    },
  },
  deno: {
    onLoad: async ({ withTypedArray }) => {
      if (withTypedArray) {
        const { writeFile } = await import(
          './dynamic-import-apis/deno/writeFile.js'
        )

        return writeFile
      }

      const { writeTextFile } = await import(
        './dynamic-import-apis/deno/writeTextFile.js'
      )

      return writeTextFile
    },
    onCall: async (runtimeModule, path, data, options) => {
      if (isDataTypedArray(data)) {
        // TODO: Enforce better with type guards
        const denoWriteFile = runtimeModule as DenoWriteFile

        return denoWriteFile(path, data, {
          append: options?.append ?? defaultAppend,
          create: options?.create ?? defaultCreate,
        })
      }

      const denoWriteTextFile = runtimeModule as DenoWriteTextFile

      return denoWriteTextFile(path, data, {
        append: options?.append ?? defaultAppend,
        create: options?.create ?? defaultCreate,
      })
    },
  },
}

const runtime = getRuntime()

const runtimeConfig =
  runtime !== null && Object.keys(runtimeConfigs).includes(runtime)
    ? runtimeConfigs[runtime as SupportedWriteFileRuntime]
    : null

export const writeFile = async (
  path: WriteFilePath,
  data: string | Uint8Array,
  options?: WriteFileOptions,
): Promise<void> => {
  if (!runtimeConfig) {
    throw new UnsupportedRuntimeAPIError('writeFiles')
  }

  const runtimeWriteFile = await runtimeConfig.onLoad({
    withTypedArray: isDataTypedArray(data),
  })

  return runtimeConfig.onCall(
    // Ignoring as strict validation is applied to the `RuntimeConfigs` type
    // ensuring `runtimeWriteFile` corresponds to the current runtime module
    // @ts-ignore
    runtimeWriteFile,
    path,
    data,
    options,
  )
}

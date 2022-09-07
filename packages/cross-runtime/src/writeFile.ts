import { isDeno, isBun, isNode, UnsupportedRuntimeAPIError } from './utils.js'

type WriteFilePath = string | URL

type WriteFileEncoding = 'utf8' | 'uint8'

interface WriteFileOptions<T extends WriteFileEncoding> {
  /**
   * Character encoding written to the file.
   * @default 'utf8'
   */
  encoding?: T
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

const defaultEncoding = 'utf-8'
const defaultAppend = false
const defaultCreate = true

type WriteFile<T extends WriteFileEncoding> = (
  path: WriteFilePath,
  data: string,
  options?: WriteFileOptions<T>,
) => Promise<void>

/**
 * Private var to lazy assign the cross-runtime `writeFile` function
 */
let _writeFile: WriteFile<'utf8'>

if (isNode()) {
  const { writeFile } = await import('node:fs/promises')

  _writeFile = (path, data, options) =>
    writeFile(path, data, {
      encoding: defaultEncoding,
      // https://nodejs.org/api/fs.html#file-system-flags
      flag:
        (options?.append ?? defaultAppend ? 'a' : 'w') +
        (options?.create ?? defaultCreate ? '' : 'x'),
    })
} else if (isDeno()) {
  _writeFile = (path, data, options) =>
    Deno.writeTextFile(path, data, {
      append: options?.append ?? defaultAppend,
      create: options?.create ?? defaultCreate,
    })
} else if (isBun()) {
  _writeFile = async (path, data, options) => {
    // TODO: Polyfill Bun API
    // - options.append - If true, read file and manually append to it
    // - options.create - If false, check if file exists and manually throw error
    if (options?.append) throw new Error('Bun does not support [append] mode')
    if (options?.create) throw new Error('Bun does not support [create] mode')

    await Bun.write(path, data)
  }
} else {
  const error = new UnsupportedRuntimeAPIError('writeFile')

  // Unsupported API - Throw on call or member access
  _writeFile = new Proxy(() => Promise.reject(error), {
    get: () => {
      throw error
    },
    set: () => {
      throw error
    },
  })
}

export const writeFile: WriteFile<'utf8'> = _writeFile

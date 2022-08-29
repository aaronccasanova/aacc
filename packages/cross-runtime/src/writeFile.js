import { isDeno, isBun, isNode, UnsupportedRuntimeAPIError } from './utils.js'

/** @typedef {string | URL} WriteFilePath */

/**
 * @typedef {Object} WriteFileOptions
 * @prop {'utf-8'} [encoding='utf-8'] - Character encoding written to the file.
 * @prop {boolean} [append=false] - If true, append to a file instead of overwriting contents.
 * @prop {boolean} [create=true] - If true, create a file if one doesn't exist
 */

const defaultEncoding = 'utf-8'
const defaultAppend = false
const defaultCreate = true

/** @typedef {(path: WriteFilePath, data: string, options?: WriteFileOptions) => Promise<void>} WriteFile */

/**
 * Private var to lazy assign the cross-runtime `writeFile` function
 * @type {WriteFile}
 */
let _writeFile

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

/** @type {WriteFile} */
export const writeFile = _writeFile

import { isDeno, isNode, isBun, UnsupportedRuntimeAPIError } from './utils.js'

/** @typedef {string | URL} ReadFilePath */

/**
 * @typedef {Object} ReadFileOptions
 * @prop {'utf-8'} [encoding='utf-8'] - Character encoding of the read file.
 */

const defaultEncoding = 'utf-8'

/** @typedef {(path: ReadFilePath, options?: ReadFileOptions) => Promise<string>} ReadFile */

/**
 * Private var to lazy assign the cross-runtime `readFile` function.
 * @type {ReadFile}
 */
let _readFile

if (isNode() || isBun()) {
  const { readFile } = await import('node:fs/promises')
  _readFile = (path /* , _options */) =>
    readFile(path, { encoding: defaultEncoding })
  ///
} else if (isDeno()) {
  _readFile = (path /* , _options */) => Deno.readTextFile(path)
  ///
} else {
  const error = new UnsupportedRuntimeAPIError('readFile')

  // Unsupported API - Throw on call or member access
  _readFile = new Proxy(() => Promise.reject(error), {
    get: () => {
      throw error
    },
    set: () => {
      throw error
    },
  })
}

/** @type {ReadFile} */
export const readFile = _readFile

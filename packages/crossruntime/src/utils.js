/* eslint-disable max-classes-per-file */

// TODO:
// Add isBun
// Add isCloudflareWorker

/** @typedef {'browser' | 'bun' | 'deno' | 'node'} Runtime */

/**
 * Detects if the current runtime is the browser.
 */
export const isBrowser = () =>
  !!(
    typeof globalThis !== 'undefined' &&
    globalThis.document &&
    globalThis.document.createElement
  )

/**
 * Detects if the current runtime is Bun.
 * - https://stackoverflow.com/a/35813135
 */
export const isBun = () =>
  Boolean(
    typeof process !== 'undefined' &&
      typeof process.versions.bun !== 'undefined' &&
      process.isBun,
  )

/**
 * Detects if the current runtime is Deno.
 */
export const isDeno = () => Boolean('Deno' in globalThis)

/**
 * Detects if the current runtime is Node.js.
 * - https://github.com/sindresorhus/make-asynchronous/blob/8be62c951084a3a950bc168f6a041c3d1d962cab/index.js#L4
 * - https://deno.com/blog/dnt-oak
 * - https://stackoverflow.com/a/35813135
 */
export const isNode = () =>
  typeof process !== 'undefined' &&
  typeof process.versions.node !== 'undefined' &&
  // Hacky solution to not falsely detect a Bun runtime.
  // Reason: Bun's `process.versions.node` includes version and creates false positives.
  typeof process.versions.bun === 'undefined'

/**
 * Returns the current runtime.
 * @returns {Runtime | null}
 */
export const getRuntime = () => {
  if (isBrowser()) {
    return 'browser'
  }
  if (isBun()) {
    return 'bun'
  }
  if (isDeno()) {
    return 'deno'
  }
  if (isNode()) {
    return 'node'
  }

  return null
}

/**
 * Throws an error if the current runtime is not supported.
 *
 * @example
 * if (!getRuntime()) throw new UnknownRuntimeError()
 */
export class UnknownRuntimeError extends Error {
  constructor() {
    super()
    this.name = 'UnknownRuntimeError'
    this.message = 'Unknown runtime environment'
  }
}

export class UnsupportedRuntimeAPIError extends Error {
  /** @param {string} api - The unsupported API for the current runtime */
  constructor(api) {
    super()
    this.name = 'UnsupportedRuntimeAPIError'
    this.message = `Unsupported API [${api}] for the current runtime [${
      getRuntime() ?? 'unknown'
    }]`
  }
}

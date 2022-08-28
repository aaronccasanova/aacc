/* eslint-disable max-classes-per-file */

// TODO:
// Add isBun
// Add isCloudflareWorker

/** @typedef {'browser' | 'deno' | 'node'} Runtime */

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
 * Detects if the current runtime is Deno.
 */
export const isDeno = () => Boolean('Deno' in globalThis)

/**
 * Detects if the current runtime is Node.js.
 * - https://github.com/sindresorhus/make-asynchronous/blob/8be62c951084a3a950bc168f6a041c3d1d962cab/index.js#L4
 * - https://deno.com/blog/dnt-oak
 */
export const isNode = () => Boolean(globalThis.process?.versions?.node)

/**
 * Returns the current runtime.
 * @returns {Runtime | null}
 */
export const getRuntime = () => {
  if (isBrowser()) {
    return 'browser'
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

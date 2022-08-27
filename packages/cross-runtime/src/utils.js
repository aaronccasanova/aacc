// TODO:
// Add isBun
// Add isCloudflareWorker

/**
 * Detects if the current environment is Node.js.
 * - https://github.com/sindresorhus/make-asynchronous/blob/8be62c951084a3a950bc168f6a041c3d1d962cab/index.js#L4
 * - https://deno.com/blog/dnt-oak
 */
export const isNode = () => Boolean(globalThis.process?.versions?.node)

/**
 * Detects if the current environment is Deno.
 */
export const isDeno = () => Boolean('Deno' in globalThis)

export const getRuntime = () => {
  if (isNode()) {
    return 'node'
  }

  if (isDeno()) {
    return 'deno'
  }

  return 'unknown'
}

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
    this.message = `Unsupported API [${api}] for the current runtime [${getRuntime()}]`
  }
}

import {
  isBrowser,
  isDeno,
  isNode,
  UnsupportedRuntimeAPIError,
} from './utils.js'

/**
 * Private var to lazy assign the crossruntime `Worker` class.
 * @type {typeof globalThis.Worker}
 */
let _Worker

if (isNode()) {
  const webWorker = await import('web-worker')
  _Worker = webWorker.default
  ///
} else if (isDeno() || isBrowser()) {
  _Worker = globalThis.Worker
  ///
} else {
  const error = new UnsupportedRuntimeAPIError('Worker')

  // Unsupported API - Throw on call or member access
  // @ts-ignore
  _Worker = new Proxy(
    class UnsupportedRuntime {
      constructor() {
        throw error
      }
    },
    {
      get: () => {
        throw error
      },
      set: () => {
        throw error
      },
    },
  )
}

/** @type {typeof globalThis.Worker} */
export const Worker = _Worker

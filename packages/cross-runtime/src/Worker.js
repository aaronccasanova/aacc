import {
  isBrowser,
  isDeno,
  isNode,
  UnsupportedRuntimeAPIError,
} from './utils.js'

/**
 * Private var to lazy assign the cross-runtime `Worker` class.
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
  throw new UnsupportedRuntimeAPIError('Worker')
}

/** @type {typeof globalThis.Worker} */
export const Worker = _Worker

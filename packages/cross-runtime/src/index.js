import { isDeno, isNode, UnknownRuntimeError } from './utils.js'

if (!(isDeno() || isNode())) {
  throw new UnknownRuntimeError()
}

export { getRuntime, isDeno, isNode, UnknownRuntimeError } from './utils.js'

export { readFile } from './readFile.js'
export { writeFile } from './writeFile.js'
export { Worker } from './Worker.js'

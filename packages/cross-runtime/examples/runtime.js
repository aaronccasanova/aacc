import { isDeno, isNode, getRuntime } from '../src/index.js'

console.log('getRuntime:', getRuntime())
console.log('isDeno:', isDeno())
console.log('isNode:', isNode())

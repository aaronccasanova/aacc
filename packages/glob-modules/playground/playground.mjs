import * as path from 'node:path'
import * as url from 'node:url'
import { globModules as globModulesRaw } from '../dist/esm/index.mjs'

/** @type {import('../dist/types/index.js').globModules} */
// @ts-ignore
const globModules = globModulesRaw

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const modules = await globModules('./modules/*.mjs', {
  importMeta: import.meta,
})
/* {
  modules: {
    one: { default: 1, one: 'one' },
    two: { default: 2 },
    four: { default: 4 },
  },
} */

const nestedModules = await globModules('./modules/nested-modules/*.mjs', {
  importMeta: import.meta,
})
/* {
  modules: {
    'nested-modules': {
			five: 5,
			six: 6,
			eight: 8,
		},
  },
} */

const allModules = await globModules('./modules/**/*.mjs', {
  cwd: __dirname,
})
/* {
  modules: {
    one: { default: 1 },
    two: { default: 2 },
    four: { default: 4 },
    'nested-modules': {
			five: 5,
			six: 6,
			eight: 8,
		},
  },
} */

const cjsModules = await globModules('./modules/**/*.js', {
  cwd: __dirname,
})
/* {
  modules: {
    three: { default: 3 },
    'nested-modules': {
			seven: 8,
		},
  },
} */

console.log('allModules:', JSON.stringify(allModules, null, 2))

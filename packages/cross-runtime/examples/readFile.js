import * as cr from '../src/index.js'

console.log(await cr.readFile(new URL('./readFile.js', import.meta.url)))

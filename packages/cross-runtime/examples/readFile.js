import { readFile } from '../src/index.js'

console.log(await readFile(new URL('./readFile.js', import.meta.url)))

import * as cr from '../dist/readFile-map.js'

const decoder = new TextDecoder('utf-8')

const data = await cr.readFile(
  new URL('./readFile-uint8.js', import.meta.url),
  { encoding: 'uint8' },
)

console.log(decoder.decode(data))
console.log('-----------------')
const data2 = await cr.readFile(
  new URL('./readFile-uint8.js', import.meta.url),
  { encoding: 'uint8' },
)

console.log(decoder.decode(data2))
console.log('-----------------')

import * as fs from 'node:fs'

const decoder = new TextDecoder('utf-8')

const data = await fs.promises.readFile(
  new URL('./readFile-uint8-node.js', import.meta.url),
)

console.log('data:', data)
console.log('-----------------')
console.log(decoder.decode(data))

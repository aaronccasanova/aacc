import * as fs from 'node:fs'

import processor from './processor.mjs'
import { getStdinFiles } from './utils.mjs'

const files = await getStdinFiles()

await Promise.all(files.map(processFile))

async function processFile(filePath) {
  const fileContent = await fs.promises.readFile(filePath, 'utf8')

  const results = processor({ filePath, fileContent })

  console.log('Process results:', results)
}

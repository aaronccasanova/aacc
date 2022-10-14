import * as fs from 'node:fs'
import { chunksToLines } from './utils.mjs'

const processorPath = process.argv[2]

if (!processorPath) throw new Error('Missing processor path')

/**
 * @typedef {(options: ProcessorOptions) => void | Promise<void>} Processor
 *
 * @typedef {object} ProcessorOptions
 * @property {string} filePath
 * @property {string} fileContent
 */

/** @type {{ default: Processor }} */
const { default: processor } = await import(processorPath)

if (!processor) throw new Error('Invalid processor path')

const chunkSize = 50
const chunkedFiles = Array.from({ length: chunkSize }, () => '')

async function main() {
  let index = 0

  for await (const line of chunksToLines(process.stdin)) {
    chunkedFiles[index] = line

    index += 1

    if (index < chunkSize) continue

    index = 0

    await Promise.all(chunkedFiles.map(processFile))
  }

  const restFiles = chunkedFiles.filter(Boolean)

  if (!restFiles.length) return

  await Promise.all(restFiles.map(processFile))
}

async function processFile(_, fileIndex, files) {
  const filePath = files[fileIndex]

  files[fileIndex] = ''

  const fileContent = await fs.promises.readFile(filePath, 'utf8')

  return processor({ filePath, fileContent })
}

main().catch((error) => {
  console.error(`Worker error: ${error}`)
  process.exit(1)
})

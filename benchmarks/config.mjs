// node benchmarks/run-workers.mjs && node benchmarks/run-forks.mjs

import * as url from 'node:url'

export const benchmarkIterations = 20
export const tallyIterations = 30
export const workerPoolSize = 7

export const filesCount = 2000
export const filesChunkSize = 50

export const workerPath = getPath('./worker.mjs')
export const forkPath = getPath('./fork.mjs')
export const processorPath = getPath('./processor.mjs')
export const dataPath = getPath('./data.txt')

export const workerOptions = { workerData: { processorPath, tallyIterations } }

export const files = Array.from({ length: filesCount }, () => dataPath)
export const chunkedFiles = chunkFiles(files, filesChunkSize)

function chunkFiles(files, chunkSize) {
  const chunkedFiles = []

  for (let i = 0; i < files.length; i += chunkSize) {
    chunkedFiles.push(files.slice(i, i + chunkSize))
  }

  return chunkedFiles
}

function getPath(path) {
  return url.fileURLToPath(new URL(path, import.meta.url))
}

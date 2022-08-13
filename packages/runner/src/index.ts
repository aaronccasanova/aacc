/* eslint-disable no-await-in-loop */
// @ts-nocheck
import * as path from 'node:path'
import * as os from 'node:os'

import Piscina from 'piscina'

import type { WorkerResult } from './worker'

interface RunnerOptions {
  workers?: number
  files: string[]
  processor: string
  onProcessed?: <T extends any = null>(result: WorkerResult) => Promise<T> | T
}

export async function runner(options: RunnerOptions): Promise<WorkerResult> {
  const chunkedFiles: string[][] = []
  const chunkSize = 50

  for (let i = 0; i < options.files.length; i += chunkSize) {
    chunkedFiles.push(options.files.slice(i, i + chunkSize))
  }

  const numOfWorkers = Math.min(
    chunkedFiles.length,
    options.workers
      ? Math.min(options.workers, os.cpus().length)
      : os.cpus().length,
  )

  const piscina = new Piscina({
    filename: path.resolve(__dirname, './worker.js'),
    minThreads: numOfWorkers,
    maxThreads: numOfWorkers,
  })

  let currentChunk = 0

  await Promise.all(
    Array.from({ length: numOfWorkers }).map(async () => {
      while (currentChunk < chunkedFiles.length) {
        const chunkIndex = currentChunk
        currentChunk += 1

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const results = await piscina.run({
          processor: options.processor,
          filePaths: chunkedFiles[chunkIndex]!,
        })

        if (options.onProcessed) {
          await options?.onProcessed(results)
        }
      }
    }),
  )
}

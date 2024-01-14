/* eslint-disable no-await-in-loop */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as path from 'node:path'
import * as os from 'node:os'
import * as wt from 'worker_threads'

import * as Comlink from 'comlink'
import nodeEndpoint from 'comlink/dist/umd/node-adapter'

import type { WorkerApi, WorkerResult } from './worker'

interface RunnerOptions {
  workers?: number
  files: string[]
  processor: string
  onProcessed?: <T = null>(result: WorkerResult) => Promise<T> | T
}

export async function runner(options: RunnerOptions): Promise<WorkerResult> {
  const numOfWorkers = Math.min(
    options.files.length,
    options.workers
      ? Math.min(options.workers, os.cpus().length)
      : os.cpus().length,
  )

  const chunkedFiles: string[][] = []
  const chunkSize = 50

  for (let i = 0; i < options.files.length; i += chunkSize) {
    chunkedFiles.push(options.files.slice(i, i + chunkSize))
  }

  const workers = []

  for (let i = 0; i < numOfWorkers; i += 1) {
    const worker = new wt.Worker(path.join(__dirname, './worker.js'))

    workers.push(Comlink.wrap<WorkerApi>(nodeEndpoint(worker)))
  }

  let currentChunk = 0

  await Promise.all(
    workers.map(async (worker) => {
      await worker.loadProcessor(options.processor)

      while (currentChunk < chunkedFiles.length) {
        const chunkIndex = currentChunk
        currentChunk += 1

        const results = await worker.processFiles({
          filePaths: chunkedFiles[chunkIndex]!,
        })

        if (options.onProcessed) {
          await options?.onProcessed(results)
        }
      }

      worker[Comlink.releaseProxy]()
    }),
  )
}

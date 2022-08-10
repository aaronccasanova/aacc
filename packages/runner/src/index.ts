import * as path from 'node:path'
import * as os from 'node:os'
import * as wt from 'worker_threads'

import * as Comlink from 'comlink'
import nodeEndpoint from 'comlink/dist/umd/node-adapter'

import type { WorkerApi, Processor } from './worker'

interface RunnerOptions {
  workers?: number
  files: string[]
  processor: Processor
}

export async function runner(options: RunnerOptions) {
  const numOfWorkers = Math.min(
    options.files.length,
    options.workers
      ? Math.min(options.workers, os.cpus().length)
      : os.cpus().length,
  )

  const workers = []

  for (let i = 0; i < numOfWorkers; i += 1) {
    const worker = new wt.Worker(path.join(__dirname, './worker.js'))
    workers.push(Comlink.wrap<WorkerApi>(nodeEndpoint(worker)))
  }

  let currentFile = 0

  await Promise.all(
    workers.map(async (worker) => {
      while (currentFile < options.files.length) {
        // eslint-disable-next-line no-plusplus
        const fileIndex = currentFile++

        // eslint-disable-next-line no-await-in-loop
        await worker.processFile(Comlink.proxy(options.processor), {
          filePath: options.files[fileIndex]!,
        })
      }

      worker[Comlink.releaseProxy]()

      return worker
    }),
  )
}

runner({
  workers: 2,
  files: [
    path.join(__dirname, 'index.js'),
    path.join(__dirname, 'worker.js'),
    path.join(__dirname, 'index.js'),
    path.join(__dirname, 'worker.js'),
  ],
  processor: (options) => {
    console.log('filePath: ', options.filePath)
    console.log('fileContent: ', options.fileContent.slice(0, 10))
  },
}).catch(console.error)

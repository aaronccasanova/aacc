// @ts-nocheck
import * as path from 'node:path'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as wt from 'worker_threads'
import pMap from 'p-map'

import * as Comlink from 'comlink'
import nodeEndpoint from 'comlink/dist/umd/node-adapter'

import type { WorkerApi, WorkerResult, ProcessorImport } from './worker'

interface RunnerOptions {
  // TODO: Remove this flag. It's only used for comparing workers and concurrent pending promises.
  withWorkers?: boolean
  workers?: number
  files: string[]
  processor: string
  onProcessed?: <T extends any = null>(result: WorkerResult) => Promise<T> | T
}

export async function runner(options: RunnerOptions): Promise<WorkerResult> {
  const startTime = process.hrtime()

  const numOfWorkers = Math.min(
    options.files.length,
    options.workers
      ? Math.min(options.workers, os.cpus().length)
      : os.cpus().length,
  )

  if (options.withWorkers ?? true) {
    console.log(
      `Processing ${options.files.length} files with ${numOfWorkers} workers`,
    )

    const workers = []

    for (let i = 0; i < numOfWorkers; i += 1) {
      const worker = new wt.Worker(path.join(__dirname, './worker.js'))
      // const worker = new wt.Worker(
      //   url.fileURLToPath(new URL('./worker.js', import.meta.url)),
      // )
      workers.push(Comlink.wrap<WorkerApi>(nodeEndpoint(worker)))
    }

    let currentFile = 0

    await Promise.all(
      workers.map(async (worker) => {
        await worker.loadProcessor(options.processor)

        while (currentFile < options.files.length) {
          // eslint-disable-next-line no-plusplus
          const fileIndex = currentFile++

          // eslint-disable-next-line no-await-in-loop
          const state = await worker.processFile({
            filePath: options.files[fileIndex]!,
          })

          // eslint-disable-next-line no-await-in-loop
          await options?.onProcessed(state)
        }

        worker[Comlink.releaseProxy]()

        return worker
      }),
    )
  } else {
    console.log(
      `Processing ${options.files.length} files with p-map and ${numOfWorkers} concurrent pending promises`,
    )

    const { default: processor } = (await import(
      options.processor
    )) as ProcessorImport

    await pMap(
      options.files,
      async (filePath) => {
        const fileContent = await fs.promises.readFile(filePath, 'utf-8')

        const state = await processor({
          fileContent,
          filePath,
        })

        // eslint-disable-next-line no-await-in-loop
        await options?.onProcessed(state ?? null)
      },
      {
        concurrency: numOfWorkers,
      },
    )
  }

  const endTime = process.hrtime(startTime)
  const elapsedTime = (endTime[0] + endTime[1] / 1e9).toFixed(3)

  console.log('\n')
  console.log(`Elapsed time: ${elapsedTime}seconds`)
}

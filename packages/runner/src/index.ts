/* eslint-disable no-await-in-loop */
// @ts-nocheck
import * as path from 'node:path'
import * as os from 'node:os'
import * as cp from 'node:child_process'

import type {
  ParentMessage,
  WorkerData,
  WorkerMessage,
  WorkerResult,
} from './worker'

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

  const workers = []
  const workerData: WorkerData = {
    processor: options.processor,
  }

  for (let i = 0; i < numOfWorkers; i += 1) {
    workers.push(
      cp.fork(path.join(__dirname, './worker.js'), [workerData.processor]),
    )
  }

  let currentChunk = 0
  function nextChunk() {
    const chunkIndex = currentChunk
    currentChunk += 1

    return chunkedFiles[chunkIndex] ?? null
  }

  await Promise.all(
    workers.map(
      (worker) =>
        new Promise((resolve, reject) => {
          postMessage(worker, { action: 'process', filePaths: nextChunk() })

          worker.on('error', reject)
          worker.on('exit', (code) =>
            code !== 0
              ? reject(new Error('Failed to process file'))
              : resolve(),
          )

          // TODO: Fix this.. Don't believe async/await in event emitters is encouraged.
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          worker.on('message', async (message: WorkerMessage) => {
            switch (message.action) {
              case 'processed':
              default: {
                const filePaths = nextChunk()

                if (filePaths) {
                  postMessage(worker, { action: 'process', filePaths })
                } else {
                  postMessage(worker, { action: 'exit' })
                }

                if (options.onProcessed) {
                  await options.onProcessed(results)
                }
              }
            }
          })
        }),
    ),
  )
}

function postMessage(worker: cp.ChildProcess, message: ParentMessage) {
  worker.send(message)
}

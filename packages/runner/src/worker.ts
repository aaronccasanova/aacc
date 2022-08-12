/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck
import * as wt from 'node:worker_threads'
import * as fs from 'node:fs'

if (!wt.parentPort) throw new Error('This is not a worker thread')

const workerData = wt.workerData as WorkerData

// eslint-disable-next-line import/no-dynamic-require
const processor: Processor = require(workerData.processor)

export interface WorkerData {
  processor: string
}

export type ParentMessage =
  | { action: 'process'; filePaths: string[] }
  | { action: 'exit' }

export type WorkerMessage<T extends any = null> = {
  action: 'processed'
  result?: T
}

type ProcessorOptions = {
  filePath: string
  fileContent: string
}

export type Processor<T extends any = null> = (
  options: ProcessorOptions,
) => Promise<T> | T

// TODO: Fix this.. Don't believe async/await in event emitters is encouraged.
// eslint-disable-next-line @typescript-eslint/no-misused-promises
wt.parentPort.on('message', async (message: ParentMessage) => {
  if (message.action === 'exit') process.exit()

  if (!processor) throw new Error('No processor loaded')

  await Promise.all(
    message.filePaths.map(async (filePath) => {
      const fileContent = await fs.promises.readFile(filePath, 'utf-8')

      const result = await processor({
        fileContent,
        filePath,
      })

      return result ?? null
    }),
  )

  wt.parentPort!.postMessage({ action: 'processed' })

  // return results ?? []
})

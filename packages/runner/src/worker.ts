/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck
import * as fs from 'node:fs'

// eslint-disable-next-line import/no-dynamic-require
const processor: Processor = require(process.argv[2])

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
process.on('message', async (message: ParentMessage) => {
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

  process.send({ action: 'processed' })

  // return results ?? []
})

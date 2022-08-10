import * as wt from 'node:worker_threads'
import * as fs from 'node:fs'

import * as Comlink from 'comlink'
import nodeEndpoint from 'comlink/dist/umd/node-adapter'

type ProcessorOptions = {
  filePath: string
  fileContent: string
}

export type Processor = (options: ProcessorOptions) => Promise<void> | void

export interface WorkerApi {
  processFile: (
    processor: Processor,
    options: {
      filePath: string
    },
  ) => Promise<void>
}

const workerApi: WorkerApi = {
  async processFile(processor, options) {
    const content = await fs.promises.readFile(options.filePath, 'utf-8')

    await processor({
      filePath: options.filePath,
      fileContent: content,
    })
  },
}

Comlink.expose(workerApi, nodeEndpoint(wt.parentPort as wt.MessagePort))

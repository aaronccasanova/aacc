/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck
import * as wt from 'node:worker_threads'
import * as fs from 'node:fs'

import * as Comlink from 'comlink'
import nodeEndpoint from 'comlink/dist/umd/node-adapter'

type ProcessorOptions = {
  filePath: string
  fileContent: string
}

export type Processor<T extends any = null> = (
  options: ProcessorOptions,
) => Promise<T> | T

export interface ProcessorImport {
  default: Processor
}

export interface WorkerApi {
  processor: null | Processor
  loadProcessor(processorPath: string): Promise<void>
  processFile: <T extends any = null>(options: {
    filePath: string
  }) => Promise<T>
}

const workerApi: WorkerApi = {
  processor: null,
  async loadProcessor(processorPath) {
    const { default: processor }: ProcessorImport = await import(processorPath)

    this.processor = processor
  },
  async processFile(options) {
    if (!this.processor) throw new Error('No processor loaded')

    const fileContent = await fs.promises.readFile(options.filePath, 'utf-8')

    const state = await this.processor({
      fileContent,
      filePath: options.filePath,
    })

    return state ?? null
  },
}

Comlink.expose(workerApi, nodeEndpoint(wt.parentPort as wt.MessagePort))

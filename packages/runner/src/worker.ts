/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck
import * as fs from 'node:fs'

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

let processor: Processor | undefined

export default async (options: { processor: string; filePaths: string[] }) => {
  if (!processor) {
    const processorImport = (await import(options.processor)) as ProcessorImport

    if (!processorImport.default) throw new Error('Processor not found')
    else processor = processorImport.default
  }

  await Promise.all(
    options.filePaths.map(async (filePath) => {
      const fileContent = await fs.promises.readFile(filePath, 'utf-8')

      const result = await processor({
        fileContent,
        filePath: options.filePath,
      })

      return result ?? null
    }),
  )

  // return results ?? []
}

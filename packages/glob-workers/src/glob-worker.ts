import * as fs from 'node:fs'

export interface WorkerOptions {
  args: string[]
  filePath: string
  fileContent: string
}

export type Worker = (options: WorkerOptions) => Promise<void> | void

export type GlobWorkerOptions = {
  workerArgs: WorkerOptions['args']
  workerPath: string
  filePaths: string[]
}

export async function globWorker(options: GlobWorkerOptions): Promise<void> {
  const worker = (await import(options.workerPath)) as { default: Worker }

  async function handleFilePath(filePath: string) {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8')

    await worker.default({
      filePath,
      fileContent,
      args: options.workerArgs,
    })
  }

  await Promise.all(options.filePaths.map(handleFilePath))
}

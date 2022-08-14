import * as fs from 'node:fs'
import * as wt from 'node:worker_threads'

const processorPath = wt.workerData.processorPath
const tallyIterations = wt.workerData.tallyIterations

const { default: processor } = await import(processorPath)

getParentPort().on('message', async (message) => {
  if (message.action === 'exit') process.exit()

  if (!processor) throw new Error('No processor loaded')

  const results = await Promise.all(
    message.filePaths.map(async (filePath) => {
      const fileContent = await fs.promises.readFile(filePath, 'utf-8')

      const result = await processor({
        fileContent,
        filePath,
        tallyIterations,
      })

      return result
    }),
  )

  getParentPort().postMessage({ action: 'processed', results })
})

function getParentPort() {
  if (!wt.parentPort)
    throw new Error('This script must be run in a worker thread')

  return wt.parentPort
}

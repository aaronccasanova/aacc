import * as fs from 'node:fs'

const processorPath = process.argv[2]
const tallyIterations = parseInt(process.argv[3])

const { default: processor } = await import(processorPath)

process.on('message', async (message) => {
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

  process.send({ action: 'processed', results })
})

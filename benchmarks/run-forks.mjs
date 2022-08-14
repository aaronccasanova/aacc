import * as cp from 'node:child_process'

import {
  benchmarkIterations,
  workerPoolSize,
  forkPath,
  workerOptions,
  chunkedFiles,
} from './config.mjs'

async function run() {
  let chunk = 0
  const next = () => chunkedFiles[chunk++] ?? null

  const startTime = process.hrtime()

  const workers = []

  for (let i = 0; i < workerPoolSize; i++) {
    workers.push(
      cp.fork(forkPath, [
        workerOptions.workerData.processorPath,
        workerOptions.workerData.tallyIterations.toString(),
      ]),
    )
  }

  await Promise.all(
    workers.map(
      (worker) =>
        new Promise((resolve, reject) => {
          worker.send({ action: 'process', filePaths: next() })

          worker.on('error', reject)
          worker.on('exit', (code) =>
            code !== 0
              ? reject(new Error('Failed to process file'))
              : resolve('Processed file'),
          )

          worker.on('message', (_message) => {
            // _message.action | _message.results
            // console.log('_message.results:', _message.results)
            const filePaths = next()

            if (filePaths) {
              worker.send({ action: 'process', filePaths })
            } else {
              worker.send({ action: 'exit' })
            }
          })
        }),
    ),
  )

  return process.hrtime(startTime)
}

const endTimes = []

for (let i = 0; i < benchmarkIterations; i++) {
  const endTime = await run()

  endTimes.push(endTime)
}

const elapsedTimes = endTimes.map((endTime) =>
  parseFloat((endTime[0] + endTime[1] / 1e9).toFixed(3)),
)

const averageElapsedTime =
  elapsedTimes.reduce((a, b) => a + b) / elapsedTimes.length

console.log('Forks:   Average elapsed time:', averageElapsedTime)

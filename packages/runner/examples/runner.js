const path = require('node:path')
const globby = require('globby')

const { runner } = require('../dist/cjs/index')

// const tally = {
//   lines: 0,
//   imports: 0,
// }

const workers = 7

async function main() {
  const files = (
    await globby(['../../../**/node_modules/**/*.js'], {
      cwd: __dirname,
      absolute: true,
    })
  ).slice(0, 1500)

  console.log(`Processing ${files.length} files with ${workers} workers`)

  const startTime = process.hrtime()

  await runner({
    files,
    workers,
    processor: path.join(__dirname, './runner-worker.js'),
    // onProcessed: (result) => {
    //   tally.imports += result.imports
    //   tally.lines += result.lines
    // },
  })

  const endTime = process.hrtime(startTime)
  const elapsedTime = (endTime[0] + endTime[1] / 1e9).toFixed(3)

  console.log('\n')
  console.log(`Elapsed time: ${elapsedTime}seconds`)

  // console.log('tally:', tally)
}

main().catch(console.error)

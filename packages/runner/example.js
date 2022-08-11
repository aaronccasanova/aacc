const path = require('node:path')
const globby = require('globby')

const { runner } = require('./dist/cjs/index')

const tally = {
  lines: 0,
  imports: 0,
}

async function main() {
  const filez = await globby(['../../**/node_modules/**/*.js'], {
    absolute: true,
  })

  const files = filez.slice(0, 2000)

  await runner({
    // Comment in/out the following line to test workers vs concurrent pending promises
    // withWorkers: false,
    //
    workers: 8,
    files,
    processor: path.join(__dirname, './example-processor.js'),
    onProcessed: (result) => {
      tally.imports += result.imports
      tally.lines += result.lines
    },
  })

  console.log('tally:', tally)
}

main().catch(console.error)

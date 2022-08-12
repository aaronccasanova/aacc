const path = require('node:path')
const globby = require('globby')

const { run: jscodeshift } = require('jscodeshift/src/Runner')

const workers = 7

async function main() {
  const files = (
    await globby(['../../../**/node_modules/**/*.js'], {
      cwd: __dirname,
      absolute: true,
    })
  ).slice(0, 5000)

  console.log(`Processing ${files.length} files with ${workers} workers`)

  const startTime = process.hrtime()

  await jscodeshift(path.join(__dirname, './jscodeshift-worker.js'), files, {
    cpus: workers,
    silent: true,
  })

  const endTime = process.hrtime(startTime)
  const elapsedTime = (endTime[0] + endTime[1] / 1e9).toFixed(3)

  console.log('\n')
  console.log(`Elapsed time: ${elapsedTime}seconds`)
}

main().catch(console.error)

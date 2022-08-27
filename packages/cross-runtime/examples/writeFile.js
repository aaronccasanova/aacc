import { writeFile, getRuntime } from '../src/index.js'

const runtime = getRuntime()
const targetUrl = new URL(`./tmp/hello-${runtime}.txt`, import.meta.url)

await writeFile(targetUrl, 'Hello ')

await writeFile(targetUrl, `${runtime}!`, {
  append: true,
})

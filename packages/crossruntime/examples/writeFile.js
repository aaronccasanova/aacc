import * as cr from '../src/index.js'

const runtime = cr.getRuntime()
const targetUrl = new URL(
  `./tmp/hello-${runtime ?? 'unknown'}.txt`,
  import.meta.url,
)

await cr.writeFile(targetUrl, 'Hello ')

await cr.writeFile(targetUrl, `${runtime ?? 'unknown'}!`, {
  append: true,
})

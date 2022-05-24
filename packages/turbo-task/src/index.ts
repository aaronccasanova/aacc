/* eslint-disable */

import { globby } from 'globby'

// import url from 'url'
import fs from 'fs'
import path from 'path'

// const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const targetDir = path.join(process.cwd(), process.argv[2] || '')

const pkgPaths = await globby('**/package.json', {
  cwd: targetDir,
  ignore: ['**/node_modules/**'],
})

for (const pkgPath of pkgPaths) {
  const pkg = JSON.parse(
    await fs.promises.readFile(path.join(targetDir, pkgPath), 'utf8'),
  )

  const pkgName = pkg.name
  const pkgScripts = Object.keys(pkg.scripts || {})

  console.log('pkgName:', pkgName)
  console.log('pkgScripts:', pkgScripts.join(', '))
  console.log()
}

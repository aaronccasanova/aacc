#!/usr/bin/env node

import * as util from 'node:util'

import { randsamp as _randsamp } from '../dist/esm/index.mjs'

const randsamp =
  /** @type {typeof import('../dist/types/index.js').randsamp} */ (_randsamp)

const cli = util.parseArgs({
  options: {
    target: { type: 'string', short: 't' },
    output: { type: 'string', short: 'o' },
    ext: { type: 'string' },
    count: { type: 'string' },
  },
})

const { target: targetDir, output: outputDir, ext, count } = cli.values

if (!targetDir) {
  throw new Error('targetDir is required')
}

if (!outputDir) {
  throw new Error('outputDir is required')
}

await randsamp({
  targetDir,
  outputDir,
  sampleExtensions: ext ? ext.split(',') : undefined,
  sampleCount: count ? Number(count) : undefined,
})

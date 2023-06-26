#!/usr/bin/env node

import * as util from 'node:util'

import { globWorkers } from '../dist/esm/index.mjs'

const cli = util.parseArgs({
  allowPositionals: true,
  options: {
    /** Glob pattern of files to process */
    glob: { type: 'string', short: 'g' },
    /** Override current working directory when glob matching */
    'glob-cwd': { type: 'string' },
    /** Ignore pattern for glob matching */
    'glob-ignore': { type: 'string' },
    /* Path to worker module */
    worker: { type: 'string', short: 'w' },
    /** Override current working directory when resolving the worker file */
    'worker-cwd': { type: 'string' },
    /** Override the max number of files concurrently processed by each worker thread. */
    'worker-max-files': { type: 'string' },
    /** Override the max number of worker threads */
    'max-workers': { type: 'string' },
    /** Output debug information */
    verbose: { type: 'boolean', short: 'v' },
  },
})

if (!cli.values.glob) {
  console.error('Missing --glob option')
  process.exit(1)
}

if (!cli.values.worker) {
  console.error('Missing --worker option')
  process.exit(1)
}

await globWorkers({
  glob: cli.values.glob,
  globOptions: {
    cwd: cli.values['glob-cwd'],
    ignore: cli.values['glob-ignore'],
  },
  worker: cli.values.worker,
  workerOptions: {
    args: cli.positionals,
    cwd: cli.values['worker-cwd'],
    maxFiles: Number(cli.values['worker-max-files']) || undefined,
  },
  maxWorkers: Number(cli.values['max-workers']) || undefined,
  verbose: cli.values.verbose,
})

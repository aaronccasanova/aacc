#!/usr/bin/env node

import * as util from 'node:util'

import { globWorkers } from '../dist/esm/index.mjs'

const cli = util.parseArgs({
  allowPositionals: true,
  options: {
    /** Glob pattern of files to process */
    glob: { type: 'string', short: 'g', multiple: true },
    /** Override current working directory when glob matching */
    'glob-cwd': { type: 'string' },
    /** Ignore pattern for glob matching */
    'glob-ignore': { type: 'string', multiple: true },
    /** Allow patterns to match entries that begin with a period (`.`) */
    'glob-dot': { type: 'boolean' },
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
    /** Output help information about glob-workers */
    help: { type: 'boolean', short: 'h' },
  },
})

if (cli.values.help) {
  console.log(
    `
Usage: glob-workers [options]

Options:
  -g, --glob <pattern>...        Glob pattern of files to process. This option can be provided multiple times.
  --glob-cwd <path>              Override current working directory when glob matching.
  --glob-dot                     Allow patterns to match entries that begin with a period (.).
  --glob-ignore <pattern>...     Ignore pattern for glob matching. This option can be provided multiple times.

  -w, --worker <path>            Path to the worker module.
  --worker-cwd <path>            Override current working directory when resolving worker module.
  --worker-max-files <number>    Override max number of files concurrently processed by each worker thread.

  --max-workers <number>         Override max number of worker threads.
  -v, --verbose                  Output debug information.
  -h, --help                     Output help information about glob-workers.
    `.trim(),
  )
  process.exit(0)
}

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
    dot: cli.values['glob-dot'],
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

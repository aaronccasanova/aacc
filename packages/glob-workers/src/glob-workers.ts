import * as path from 'node:path'
import * as os from 'node:os'
import * as url from 'node:url'

import debug from 'debug'
import Piscina from 'piscina'
import globby from 'globby'
import type { GlobWorkerOptions } from './glob-worker'

const log = debug('glob-workers')

type GlobbyParameters = Parameters<typeof globby>

type GlobWorkersOptionsCWD =
  | {
      cwd?: string
      importMeta?: never
    }
  | {
      importMeta?: ImportMeta
      cwd?: never
    }

export type GlobWorkersOptions = {
  /** Glob pattern of files to process. */
  glob: GlobbyParameters[0]
  /** Glob options such as cwd, ignore patterns, etc. */
  globOptions?: GlobWorkersOptionsCWD & Omit<GlobbyParameters[1], 'cwd'>
  /** Path to the worker module. */
  worker: string
  /** Worker options such as cwd, ignore patterns, etc. */
  workerOptions?: GlobWorkersOptionsCWD & {
    /** Arguments passed to the worker. */
    args?: string[]
    /**
     * Max number of files concurrently processed by each worker thread.
     * @default 50
     */
    maxFiles?: number
  }
  /** Max number of workers threads. */
  maxWorkers?: number
  /** Output debug information. */
  verbose?: boolean

  // TODO:
  // Add fine-grained error handling options
  // e.g. per worker, per file, etc.

  // /** Number of workers threads. */
  // workers?: { worker, options }[]
}

export async function globWorkers(options: GlobWorkersOptions): Promise<void> {
  log.enabled = options.verbose ?? false

  log('Parsing options')

  const workerPath = path.resolve(getCWD(options.workerOptions), options.worker)
  const workerArgs = options.workerOptions?.args || []
  const workerMaxFiles = options.workerOptions?.maxFiles || 50

  log(`Resolving worker at ${workerPath}`)
  log(`Worker arguments: ${workerArgs.join(' ')}`)
  log('Resolving glob')

  const files = await globby(options.glob, {
    cwd: getCWD(options.globOptions),
    absolute: true,
  })

  const chunkedFiles: string[][] = []

  for (let i = 0; i < files.length; i += workerMaxFiles) {
    chunkedFiles.push(files.slice(i, i + workerMaxFiles))
  }

  log(
    `Chunked ${files.length} file(s) into ${chunkedFiles.length} chunk(s) of ${workerMaxFiles} file(s)`,
  )

  const maxThreads = Math.min(
    chunkedFiles.length,
    options.maxWorkers
      ? Math.min(options.maxWorkers, os.cpus().length)
      : os.cpus().length,
  )

  log(`Initializing worker pool with ${maxThreads} thread(s)`)

  const piscina = new Piscina({
    maxThreads,
    filename: getGlobWorkerPath(),
  })

  log(`Running workers`)

  await Promise.all(
    chunkedFiles.map((filePaths) => {
      const globWorkerOptions: GlobWorkerOptions = {
        workerArgs,
        workerPath,
        filePaths,
      }

      return piscina.run(globWorkerOptions, { name: 'globWorker' })
    }),
  )

  log(`Done!`)
}

function getCWD(options: GlobWorkersOptionsCWD = {}) {
  if (options.cwd && options.importMeta) {
    throw new Error(
      '`cwd` and `importMeta` cannot be specified at the same time',
    )
  }

  if (options.cwd) {
    return path.resolve(options.cwd)
  }

  if (options.importMeta) {
    return path.dirname(url.fileURLToPath(options.importMeta.url))
  }

  return process.cwd()
}

function getGlobWorkerPath() {
  const dirname =
    typeof __dirname !== 'undefined'
      ? __dirname
      : // @ts-expect-error - Fail fast is acceptable here
        path.dirname(url.fileURLToPath(import.meta.url))

  return path.basename(dirname) === 'esm'
    ? path.join(dirname, 'glob-worker.mjs')
    : path.join(dirname, 'glob-worker.js')
}

# glob-workers

A Node.js library and CLI for processing large numbers of files in parallel
using worker threads. Simply specify a glob pattern and worker module to be run
on each file that matches the glob.

This is especially useful for CPU-intensive operations on large file
collections, such as linting, parsing, transforming code, etc. The library is
customizable, letting you configure the number of worker threads, the maximum
number of files each worker can process concurrently, and so on.

## Usage

```sh
npx glob-workers --glob '**/*.txt' --worker './my-worker.mjs'
```

Where `my-worker.mjs` contains a default export function that accepts a single
`WorkerOptions` parameter:

```ts
// my-worker.mjs
export default function worker(options) {
  // options === { args, filePath, fileContent }
}
```

## WorkerOptions

```ts
interface WorkerOptions {
  /** Arguments passed to the worker script. */
  args: string[]
  /** Path of the current file being processed. */
  filePath: string
  /** Content of the current file being processed. */
  fileContent: string
}
```

## CLI Options

```
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
```

## JavaScript API

```sh
npm i glob-workers
```

```ts
import { globWorkers } from 'glob-workers'

await globWorkers({
  glob: '**/*.txt',
  worker: './my-worker.mjs',
})
```

### `globWorkers(options: GlobWorkersOptions): Promise<void>`

Executes the provided worker module on each file that matches the provided glob
pattern.

### `GlobWorkersOptions`

An object with the following properties:

```ts
type GlobbyParameters = Parameters<typeof globby>

interface GlobWorkersOptionsCWD {
  /** @default process.cwd() */
  cwd?: URL | string
}

export type GlobWorkersOptions = {
  /** Glob pattern of files to process. */
  glob: GlobbyParameters[0]
  /** Glob options such as cwd, ignore patterns, etc. */
  globOptions?: GlobWorkersOptionsCWD &
    Omit<NonNullable<GlobbyParameters[1]>, 'cwd' | 'absolute'>
  /** Path to the worker module. */
  worker: string
  workerOptions?: GlobWorkersOptionsCWD & {
    /** Arguments passed to the worker module. */
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
}
```

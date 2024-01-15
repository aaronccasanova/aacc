# Cross Runtime

Collection of cross runtime APIs and utilities - Write once run anywhere
`¯\_(ツ)_/¯`

- Web Platform APIs
- File System APIs
- Runtime detection APIs
- etc

> Note: This is very much a work in progress and could break at any time.

## Installation

### Node.js

```sh
npm i cross-runtime
```

```js
// node hello.js
import * as cr from 'cross-runtime'

console.log(`Hello ${cr.getRuntime()}!`)
// Hello node!
```

### Deno

```jsonc
// import-map.json
{
  "imports": {
    "cross-runtime": "https://cdn.skypack.dev/cross-runtime",
  },
}
```

```js
// deno run --import-map import-map.json hello.js
import * as cr from 'cross-runtime'

console.log(`Hello ${cr.getRuntime()}!`)
// Hello deno!
```

### Bun

```sh
bun i cross-runtime
```

```js
// bun hello.js
import * as cr from 'cross-runtime'

console.log(`Hello ${cr.getRuntime()}!`)
// Hello bun!
```

### Browser

```html
<script
  async
  src="https://ga.jspm.io/npm:es-module-shims@1.5.17/dist/es-module-shims.js"
></script>
<script type="importmap">
  {
    "imports": {
      "cross-runtime": "https://cdn.skypack.dev/cross-runtime"
    }
  }
</script>
<script type="module">
  import * as cr from 'cross-runtime'

  console.log(`Hello ${cr.getRuntime()}!`)
  // Hello browser!
</script>
```

## Runtime Support Table

| API                       | Deno | Node.js | Browser | Cloudflare Workers | Bun     |
| ------------------------- | ---- | ------- | ------- | ------------------ | ------- |
| [isDeno](#isdeno)         | ✅   | ✅      | ✅      | TODO               | ✅      |
| [isNode](#isnode)         | ✅   | ✅      | ✅      | TODO               | ✅      |
| [isBrowser](#isbrowser)   | ✅   | ✅      | ✅      | TODO               | ✅      |
| [isBun](#isbun)           | ✅   | ✅      | ✅      | TODO               | ✅      |
| [getRuntime](#getruntime) | ✅   | ✅      | ✅      | TODO               | ✅      |
| [writeFile](#writefile)   | ✅   | ✅      | N/A     | N/A                | PARTIAL |
| [readFile](#readfile)     | ✅   | ✅      | N/A     | N/A                | ✅      |
| [Worker](#worker)         | ✅   | ✅      | ✅      | ?                  | TODO    |

## APIs

The following APIs are available in all supported runtimes:

## `isDeno`

Detects if the current runtime is Deno. (See the
[runtime support table](#runtime-support-table))

```ts
type isDeno = () => boolean
```

```ts
import * as cr from 'cross-runtime'

cr.isDeno() && console.log('Hello deno!')
```

## `isNode`

Detects if the current runtime is Node.js. (See the
[runtime support table](#runtime-support-table))

```ts
type isNode = () => boolean
```

```ts
import * as cr from 'cross-runtime'

cr.isNode() && console.log('Hello node!')
```

## `getRuntime`

Returns the current runtime. (See the
[runtime support table](#runtime-support-table))

```ts
type getRuntime = () => 'browser' | 'bun' | 'deno' | 'node' | null
```

```js
import * as cr from 'cross-runtime'

console.log(`Hello ${cr.getRuntime()}!`)

// $ node get-runtime.js
// Hello node!

// $ deno run get-runtime.js
// Hello deno!
```

## `writeFile`

Cross runtime `writeFile` API inspired by the Node.js and Deno built-ins. (See
the [runtime support table](#runtime-support-table))

```ts
type writeFile = (
  path: string | URL,
  data: string,
  options?: { encoding?: 'utf-8'; append?: boolean; create?: boolean },
) => Promise<void>
```

```js
import * as cr from 'cross-runtime'

await cr.writeFile(new URL('./hello.txt', import.meta.url), 'hello!')
```

> - The Bun API is missing support for `append` and `create` (See issue
>   [#564](https://github.com/oven-sh/bun/issues/564))

## `readFile`

Cross runtime `readFile` API inspired by the Node.js and Deno built-ins. (See
the [runtime support table](#runtime-support-table))

```ts
type readFile = (
  path: string | URL,
  options?: { encoding?: 'utf-8' },
) => Promise<string>
```

```js
import * as cr from 'cross-runtime'

console.log(await cr.readFile(new URL('./hello.txt', import.meta.url)))
```

## `Worker`

Cross runtime Web `Worker` API. (See the
[runtime support table](#runtime-support-table))

```ts
type Worker = typeof globalThis.Worker
```

```js
import * as cr from 'cross-runtime'

const worker = new cr.Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
})
```

> - The Node.js API is an alias to the
>   [`web-worker`](https://www.npmjs.com/package/web-worker) library
> - The Deno API is an alias to the Web `Worker` API on the `globalThis` context

## Project Goals

The sole purpose of this library is to bridge the gap between different
JavaScript runtime APIs. All APIs are ESM only in an effort to create a write
once run anywhere experience. The library will only include APIs that differ
between runtimes with the intention of removing APIs as they become available
across all supported runtimes.
